import { Prisma } from '@prisma/client'
import { createQuery } from '../createRoute'
import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const adminHandler = async ({ input: { id } }: { input: { id: string } }) => {
  const user = await prismaClient.user.findUnique({
    where: { id }
  })
  if (user) {
    return user
  }
  throw notfoundError()
}

export type AdminUserOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getAdminUserQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
