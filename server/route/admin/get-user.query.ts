import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { notfoundError } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({
  ctx,
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
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
