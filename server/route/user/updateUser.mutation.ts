import { UserRole, UserStatus } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { UserEditionInput, editUserSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
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

const securityCheck = (ctx: SecurityRuleContext, input: UserEditionInput) => {
  if ('role' in input && input.role === UserRole.Administrator) {
    return false
  }
  const permissions = getAppContextPermissions(ctx)
  return permissions.module.users
}

export const updateUserMutation = createMutation({
  handler,
  inputValidation: editUserSchema,
  securityCheck
})
