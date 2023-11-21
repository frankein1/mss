import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { sendEmail } from '~/server/lib/email'
import { AdminCreateUserInput, adminCreateUserSchema } from '~/server/schema'
import { getUserCreationEmailContent } from '~/server/email'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc/createRouter'
import { cleanEmail } from '~/utils/user'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: AdminCreateUserInput
}) => {
  const { email, ...data } = input
  const userEmail = cleanEmail(email)
  const existingUser = await UserRepo.findUnique(ctx.user, {
    where: { email: userEmail }
  })

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A user with this email already exists'
    })
  }

  const createdUser = await UserRepo.prisma.create({
    data: {
      email: userEmail,
      ...data
    }
  })

  sendEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social - Ouverture de votre compte',
    ...getUserCreationEmailContent(createdUser)
  })

  return createdUser
}

export const createAdminUserMutation = createMutation({
  inputValidation: adminCreateUserSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
