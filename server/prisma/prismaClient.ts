import type { Prisma, PrismaClient } from '~/prisma/generated/client'
import type { DefaultArgs } from '@prisma/client/runtime/client'
import { buildPrismaClient } from '~/prisma/client'

declare global {
  // allow global `var` declarations

  var prismaClient:
    | PrismaClient<
        Prisma.LogLevel,
        Prisma.GlobalOmitConfig | undefined,
        DefaultArgs
      >
    | undefined
}

export const prismaClient = global.prismaClient || buildPrismaClient()

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prismaClient
}
