import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { sendEmail } from '~/server/lib/email'
import { AdminCreateUserInput, adminCreateUserSchema } from '~/server/schema'
import { getEmailContent } from '~/utils/user/getEmailContent'
import { AllowSecurityCheck } from '~/server/security'
import { UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: AdminCreateUserInput
}) => {
  const existingUser = await UserRepo.findUnique(ctx.user, {
    where: { email: input.email }
  })

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A user with this email already exists'
    })
  }

  const createdUser = await UserRepo.prisma.create({
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
