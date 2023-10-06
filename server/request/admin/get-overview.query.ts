import { Prisma } from '@prisma/client'
import { createQuery } from '../createRequest'
import { prismaClient } from '~/server/prisma'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'

const adminHandler = async () => {
  const users = await prismaClient.user.count()
  const structures = await prismaClient.structure.count()

  return { users, structures }
}

export type AdminOverviewOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getAdminOverviewQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
