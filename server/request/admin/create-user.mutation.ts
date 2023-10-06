import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/request'
import { sendEmail } from '~/server/lib/email'
import { prismaClient } from '~/server/prisma'
import { AdminCreateUserInput, adminCreateUserSchema } from '~/server/schema'
import { getEmailContent } from '~/utils/user/getEmailContent'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const adminHandler = async ({ input }: { input: AdminCreateUserInput }) => {
  const existingUser = await prismaClient.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A user with this email already exists'
    })
  }

  const createdUser = await prismaClient.user.create({
    data: input
  })

  sendEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social | Ouverture de votre compte',
    html: getEmailContent(createdUser)
  })

  return createdUser
}

export const createAdminUserMutation = createMutation({
  inputValidation: adminCreateUserSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
