import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { StructureRepo, UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({ ctx: { user } }: { ctx: AdminContext }) => {
  const users = await UserRepo.count(user, {})
  const structures = await StructureRepo.count(user, {})

  return { users, structures }
}

export type AdminOverviewOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getAdminOverviewQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
