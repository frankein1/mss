import { UserRepo } from '~/server/repository'
import { createMutation } from '~/server/route'
import { AdminEditUserInput, adminEditUserSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: AdminEditUserInput
}) => {
  const { id, ...user } = input

  const updatedUser = await UserRepo.update(ctx.user, {
    where: { id },
    data: user
  })

  return updatedUser
}

export const editAdminUserMutation = createMutation({
  inputValidation: adminEditUserSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
