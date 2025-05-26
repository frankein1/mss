import { Prisma, PrismaClient } from '@prisma/client'
import replaceSQLParamsInPreparedStatements from '../utils/replaceSQLParamsInPreparedStatements.ts'
import { DefaultArgs } from '@prisma/client/runtime/library'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

type LogEnvironment = 'DEBUG' | 'DEVELOPMENT' | 'PRODUCTION'

const prismaLogLevels: Record<
  LogEnvironment,
  (Prisma.LogLevel | Prisma.LogDefinition)[]
> = {
  DEBUG: [{ emit: 'event', level: 'query' }, 'error', 'warn'],
  DEVELOPMENT: ['warn', 'error'],
  PRODUCTION: ['error']
}

function getLogEnvironment(): LogEnvironment {
  if (process.env.NODE_ENV === 'production') {
    return 'PRODUCTION'
  }
  if (process.env.MSS_DEBUG === 'true' || process.env.MSS_DEBUG === '1') {
    return 'DEBUG'
  }
  return 'DEVELOPMENT'
}

const logEnvironment = getLogEnvironment()
const prismaLogLevel = prismaLogLevels[logEnvironment]

export const prismaClient: PrismaClient<
  Prisma.PrismaClientOptions,
  Prisma.LogLevel,
  DefaultArgs
> =
  global.prismaClient ||
  new PrismaClient({
    log: prismaLogLevel
  })

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}

if (logEnvironment === 'DEBUG') {
  prismaClient.$on('query', event => {
    // eslint-disable-next-line no-console
    console.log(
      '[PRISMA]',
      event.duration,
      'ms :',
      replaceSQLParamsInPreparedStatements(
        event.query,
        JSON.parse(event.params)
      )
    )
  })
}
