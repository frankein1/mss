import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { UserCreationInput, createUserSchema } from '~/server/schema'
import { SecurityRuleGrantee, canCreateUser } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { sendEmail } from '~/server/lib/email'
import { getEmailContent } from '~/utils/user/getEmailContent'
import { UserRepo } from '~/server/database'

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: UserCreationInput
) => {
  return canCreateUser(user)
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: UserCreationInput
}) => {
  const existingUser = await UserRepo.findUnique(user, {
    where: { email: input.email }
  })

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A user with this email already exists'
    })
  }

  const createdUser = await UserRepo.prisma.create({
    data: {
      structureId: user.structureId,
      ...input
    }
  })

  sendEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social | Ouverture de votre compte',
    ...getEmailContent(createdUser)
  })

  return createdUser
}

export const addUserMutation = createMutation({
  securityCheck,
  inputValidation: createUserSchema,
  handler
})
