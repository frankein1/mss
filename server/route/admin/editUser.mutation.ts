import { UserRepo } from '~/server/database'
import { createOrUpdateUser } from '~/server/integrations/brevo/service'
import { createMutation } from '~/server/route'
import type { AdminEditUserInput } from '~/server/schema'
import { adminEditUserSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'

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
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      role: user.role,
      structureId: user.structureId,
      aidantConnectAuthorisation: user.aidantConnectAuthorisation
    }
  })
  createOrUpdateUser(updatedUser.id).catch(error => {
    console.error(error)
  })

  return updatedUser
}

export const editUser = createMutation({
  inputValidation: adminEditUserSchema,
  adminHandler
})
