import { buildPrismaClient } from '~/prisma/client'
import type { MSSPrismaClient } from '~/prisma/client'

declare global {
  // allow global `var` declarations

  var prismaClient: MSSPrismaClient | undefined
}

export const prismaClient = global.prismaClient || buildPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}
