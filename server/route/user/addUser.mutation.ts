import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { UserCreationInput, createUserSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { createEmail } from '~/server/query'
import { getUserCreationEmailContent } from '~/server/email'
import { UserRepo } from '~/server/database'
import { cleanEmail } from '~/utils/user'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).create.user

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: UserCreationInput
}) => {
  const { email, ...data } = input
  const userEmail = cleanEmail(email)
  const existingUser = await UserRepo.findUnique(user, {
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
      structureId: user.structureId,
      email: userEmail,
      ...data
    }
  })

  createEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social - Ouverture de votre compte',
    ...getUserCreationEmailContent(createdUser)
  })

  return createdUser
}

export const addUserMutation = createMutation({
  securityCheck,
  inputValidation: createUserSchema,
  handler
})
