import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prismaClient:
    | PrismaClient<{
        log: ('warn' | { level: 'error'; emit: 'event' })[]
      }>
    | undefined
}

export const prismaClient =
  global.prismaClient ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [{ level: 'error', emit: 'event' }, 'warn']
        : [{ level: 'error', emit: 'event' }]
  })

/**
 * As Prisma only allows 'stdout' and 'event' as `emit` value, it emits errors
 * as events that are logged as errors in the console so it is streamed in
 * stderr
 */
prismaClient.$on('error', e => {
  // eslint-disable-next-line no-console
  console.error(e)
})

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}
