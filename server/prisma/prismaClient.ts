import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'
import { shouldLog, formatPrismaQueryLog } from '~/server/utils/logging.js'
import picocolors from 'picocolors'

declare global {
  // allow global `var` declarations

  var prismaClient: PrismaClient | undefined
}

const shouldLogPrisma = shouldLog('prisma')

const prismaLogLevels: (Prisma.LogLevel | Prisma.LogDefinition)[] =
  process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error']
if (shouldLogPrisma) {
  prismaLogLevels.push({ emit: 'event', level: 'query' })
}

const { databaseUrl } = useRuntimeConfig()

// If prismaClient variable is renamed, the Prisma eslint rule `no-restricted-syntax` in eslint.config must be adapted accordingly.
export const prismaClient: PrismaClient<
  Prisma.PrismaClientOptions,
  Prisma.LogLevel,
  DefaultArgs
> =
  global.prismaClient ||
  new PrismaClient({
    log: prismaLogLevels,
    // DATABASE_URL is not loaded from .env in the production Nitro server;
    // pass it explicitly via runtimeConfig (set NUXT_DATABASE_URL at runtime
    // or DATABASE_URL at build time). Fall back to process.env for Scalingo
    // and other platforms that inject it as a plain process environment variable.
    datasourceUrl: databaseUrl || process.env.DATABASE_URL
  })

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}

if (shouldLogPrisma) {
  prismaClient.$on('query', event => {
    // eslint-disable-next-line no-console
    console.log(
      picocolors.bgMagenta(picocolors.whiteBright(picocolors.bold(' Prisma '))),
      picocolors.bold(event.duration + 'ms'),
      event.duration > 100 ? '❌' : event.duration > 50 ? '⚠️' : '✅'
    )
    console.log(picocolors.italic(formatPrismaQueryLog(event)))
  })
}
