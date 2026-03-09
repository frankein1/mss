import { UserActivityType } from '@prisma/client'
import { UserRepo } from '~/server/database'
import { createOrUpdateUser } from '~/server/integrations/brevo/service'
import { createMutation } from '~/server/route'
import type { AdminEditUserInput } from '~/server/schema'
import { adminEditUserSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { cleanEmail } from '~/utils/user'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: AdminEditUserInput
}) => {
  const { id, email, ...user } = input

  const updatedUser = await UserRepo.prisma.update({
    where: { id },
    data: {
      email: cleanEmail(email),
      ...user
    }
  })
  createOrUpdateUser(updatedUser.id).catch(error => {
    console.error(error)
  })

  return updatedUser
}

export const editUser = createMutation({
  inputValidation: adminEditUserSchema,
  adminHandler,
  auditLog: {
    key: 'admin.user.edit',
    target: 'User',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
