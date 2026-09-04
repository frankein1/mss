import pino from 'pino'
import type { H3Event } from 'h3'

declare module 'h3' {
  interface H3EventContext {
    // Logger added to nitro context
    logger: pino.Logger
    // Set to true when the route should be logged for debug and security purpose
    logApiCall?: boolean
  }
}

/**
 * ```
 * pino.logger                                 // Logger instanciation
 * └── logger.child(request_id,ip)             // Default enrichment in nitro plugin logger.ts
 *     ├── logger.child(user_id, structure_id) // Authenticated enrichment in trpc middleware or nuxt /api endpoints
 *     └── logger.child(api_token_id)          // Authorized enrichment in nuxt /api/public endpoints
 * ```
 */
export const logger = pino({
  level: process.env.NUXT_LOGS_LEVEL ?? 'info',
  formatters: {
    level(label: string) {
      return { level: label }
    }
  },
  serializers: {
    err: (err: Error) => err.message
  },
  base: null,
  timestamp: false
})

interface LoggerUser {
  id: string
  structureId?: string | null
}

/** Allows to log authenticated calls with basic user information */
export function enrichLogger(event: H3Event, user: LoggerUser) {
  const baseLogger = event.context.logger
  event.context.logger = baseLogger.child({
    user_id: user.id,
    structure_id: user.structureId ?? ''
  })
  event.context.logApiCall = true
}

/** Allows to log authenticated calls to public api */
export function enrichPublicApiLogger(event: H3Event, token: string) {
  event.context.logger = event.context.logger.child({
    api_token_id: token
  })
  event.context.logApiCall = true
}
