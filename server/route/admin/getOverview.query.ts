import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { StructureRepo, UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({ ctx: { user } }: { ctx: AdminContext }) => {
  const users = await UserRepo.count(user, {})
  const structures = await StructureRepo.count(user, {})

  return { users, structures }
}

export type AdminOverviewOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getOverview = createQuery({
  inputValidation: emptySchema,
  adminHandler
})
