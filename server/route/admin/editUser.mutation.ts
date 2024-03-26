import { UserRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import { AdminEditUserInput, adminEditUserSchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: AdminEditUserInput
}) => {
  const { id, ...user } = input

  const updatedUser = await UserRepo.prisma.update({
    where: { id },
    data: user
  })

  return updatedUser
}

export const editAdminUserMutation = createMutation({
  inputValidation: adminEditUserSchema,
  adminHandler
})
