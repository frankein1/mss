import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export const getOverviewController = async () => {
  const users = await prismaClient.user.count()
  const structures = await prismaClient.structure.count()

  return { users, structures }
}

export type AdminOverviewOutput = Prisma.PromiseReturnType<
  typeof getOverviewController
>
