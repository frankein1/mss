import { consola } from 'consola'
import { logger } from '~~/server/utils/logger'

function mapConsolaLevel(
  level: number
): 'error' | 'warn' | 'info' | 'debug' | 'trace' {
  if (level <= 0) {
    return 'error'
  }
  if (level === 1) {
    return 'warn'
  }
  if (level <= 3) {
    return 'info'
  }
  if (level === 4) {
    return 'debug'
  }
  return 'trace'
}

export default defineNitroPlugin(nitroApp => {
  const { activateRequestLogging } = useRuntimeConfig().logs

  /** Default enrichment with requestId and IP on every request */
  nitroApp.hooks.hook('request', event => {
    const requestId = getHeader(event, 'x-request-id') ?? crypto.randomUUID()
    const realIp = getHeader(event, 'x-real-ip')

    // Trust the nginx-forwarded X-Real-IP (set from $remote_addr in servers.conf.erb)
    // Fall back to the socket peer (getRequestIP without xForwardedFor) when the header is
    // absent, e.g. local dev with no reverse proxy.
    event.context.logger = logger.child({
      request_id: requestId,
      ip_address: realIp ?? getRequestIP(event) ?? ''
    })

    // Tripwire: the rate limiter keys on x-real-ip, so a request without it lands in a
    // "" bucket shared with every other one (typically an in-process SSR call that
    // does not forward it). This is a risk for 429 on the whole platform.
    // Runs before the limiter, log only.
    if (activateRequestLogging && !realIp) {
      event.context.logger.warn(
        { path: event.path, user_agent: getHeader(event, 'user-agent') ?? '' },
        'missing-header-real-ip'
      )
    }
  })

  /** Logging hook for calls tagged with logApiCall = true except trpc which is managed by trpc middleware loggingMiddleware */
  if (activateRequestLogging) {
    nitroApp.hooks.hook('afterResponse', event => {
      if (event.path.startsWith('/api/trpc/') || !event.context.logApiCall) {
        return
      }

      const statusCode = getResponseStatus(event)
      const ok = statusCode < 400

      if (ok) {
        event.context.logger.info(
          { path: event.path, method: event.method, ok: true },
          REST_REQUEST_LOG_MSG
        )
      } else {
        event.context.logger.info(
          {
            path: event.path,
            method: event.method,
            ok: false,
            status_code: statusCode
          },
          REST_REQUEST_LOG_MSG
        )
      }
    })
  }

  /** Redirect nuxt internal logs (which use consola) to formatted pino logs in deployed envs */
  if (process.env.NODE_ENV === 'production') {
    consola.setReporters([
      {
        log(logObj) {
          const level = mapConsolaLevel(logObj.level)
          const meta: Record<string, string> = {}
          if (logObj.tag) {
            meta.component = logObj.tag
          }

          logger[level](meta, logObj.args.map(String).join(' '))
        }
      }
    ])
  }
})
