import { PrismaPg } from '@prisma/adapter-pg'
import type { Prisma } from './generated/client'
import { PrismaClient } from './generated/client'
import picocolors from 'picocolors'

const shouldLogPrisma = shouldLog('prisma')

const prismaLogLevels: (Prisma.LogLevel | Prisma.LogDefinition)[] =
  process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error']
if (shouldLogPrisma) {
  prismaLogLevels.push({ emit: 'event', level: 'query' })
}

export function buildPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter, log: prismaLogLevels })

  if (shouldLogPrisma) {
    prisma.$on('query', event => {
      // eslint-disable-next-line no-console
      console.log(
        picocolors.bgMagenta(
          picocolors.whiteBright(picocolors.bold(' Prisma '))
        ),
        picocolors.bold(event.duration + 'ms'),
        event.duration > 100 ? '❌' : event.duration > 50 ? '⚠️' : '✅'
      )
      console.log(picocolors.italic(formatPrismaQueryLog(event)))
    })
  }

  return prisma
}
