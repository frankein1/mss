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
  /** Default enrichment with requestId and IP on every request */
  nitroApp.hooks.hook('request', event => {
    const requestId = getHeader(event, 'x-request-id') ?? crypto.randomUUID()

    event.context.logger = logger.child({
      request_id: requestId,
      ip_address: getRequestIP(event, { xForwardedFor: true }) ?? ''
    })
  })

  /** Logging hook for calls tagged with logApiCall = true except trpc which is managed by trpc middleware loggingMiddleware */
  if (useRuntimeConfig().logs.activateRequestLogging) {
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
