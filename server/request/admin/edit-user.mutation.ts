import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/request'
import { AdminEditUserInput, adminEditUserSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const adminHandler = async ({ input }: { input: AdminEditUserInput }) => {
  const { id, ...user } = input

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: user
  })

  return updatedUser
}

export const editUserMutation = createMutation({
  inputValidation: adminEditUserSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
