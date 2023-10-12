import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { prismaClient } from '~/server/prisma'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { StructureRepo } from '~/server/repository'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({ ctx: { user } }: { ctx: AdminContext }) => {
  const users = await prismaClient.user.count()
  const structures = await StructureRepo.count(user)

  return { users, structures }
}

export type AdminOverviewOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getAdminOverviewQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
