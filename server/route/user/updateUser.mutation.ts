import {
  UserActivityObject,
  UserActivityType,
  UserRole,
  UserStatus
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateUserInput } from '~/server/schema'
import { editUserSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { UserRepo } from '~/server/database'
import { TRPCError } from '@trpc/server'

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: UpdateUserInput
}) => {
  // user cannot change is own status or role
  const inputStatus = input.status ? UserStatus.Active : UserStatus.Disabled
  if (
    user.id === input.id &&
    (user.role !== input.role || user.status !== inputStatus)
  ) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'user cannot change is own status or role'
    })
  }
  return await UserRepo.update(user, {
    select: { id: true },
    where: { id: input.id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      aidantConnectAuthorisation: input.aidantConnectAuthorisation || null,
      role: input.role,
      status: input.status ? UserStatus.Active : UserStatus.Disabled
    }
  })
}

const securityCheck = (ctx: SecurityRuleContext, input: UpdateUserInput) => {
  // trying to change role to Admin
  if (input.role === UserRole.Administrator) {
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
