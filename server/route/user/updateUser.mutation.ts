import {
  UserActivityObject,
  UserActivityType,
  UserRole,
  UserStatus
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UserEditionInput } from '~/server/schema'
import { editUserSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
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
  securityCheck,
  auditLog: {
    key: 'user.update',
    target: UserActivityObject.User,
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
