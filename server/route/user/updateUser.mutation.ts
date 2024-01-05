import { UserStatus } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { UserEditionInput, editUserSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  canEditUser,
  canEditUserRole
} from '~/server/security'
import { UserRepo } from '~/server/database'

const handler = async ({
  ctx: { user: _user },
  input: { id, ...rest }
}: {
  ctx: ProtectedAppContext
  input: UserEditionInput
}) => {
  if ('status' in rest) {
    return await UserRepo.prisma.update({
      where: { id },
      data: { status: rest.status ? UserStatus.Active : UserStatus.Disabled }
    })
  }
  return await UserRepo.prisma.update({ where: { id }, data: rest })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UserEditionInput
) => {
  const target = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id }
  })
  if ('role' in input) {
    return (
      canEditUserRole(ctx.user, target, input) && canEditUser(ctx.user, target)
    )
  }
  return canEditUser(ctx.user, target)
}

export const updateUserMutation = createMutation({
  handler,
  inputValidation: editUserSchema,
  securityCheck
})
