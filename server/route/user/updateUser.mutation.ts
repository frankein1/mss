import { UserStatus } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { UserEditionInput, editUserSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
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
  user: SecurityRuleGrantee,
  input: UserEditionInput
) => {
  const target = await UserRepo.findUniqueOrThrow(user, {
    where: { id: input.id }
  })
  if ('role' in input) {
    return canEditUserRole(user, target, input) && canEditUser(user, target)
  }
  return canEditUser(user, target)
}

export const updateUserMutation = createMutation({
  handler,
  inputValidation: editUserSchema,
  securityCheck
})
