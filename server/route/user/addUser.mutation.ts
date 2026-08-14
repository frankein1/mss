import { TRPCError } from '@trpc/server'
import { createMutation } from '~~/server/route'
import type { CreateUserInput } from '~~/server/schema'
import { createUserSchema } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import type { ProtectedAppContext } from '~~/server/trpc'
import { createEmail } from '~~/server/query'
import { getUserCreationEmailContent } from '~~/server/email'
import { UserRepo } from '~~/server/database'
import { cleanEmail } from '~/utils/user'
import { createEmailSubject } from '~~/server/email/createEmailSubject'
import { UserActivityObject, UserActivityType } from '@prisma/client'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.users

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: CreateUserInput
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
    select: {
      id: true,
      email: true,
      structure: {
        select: { siret: true }
      }
    },
    data: {
      structureId: user.structureId,
      email: userEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      aidantConnectAuthorisation: data.aidantConnectAuthorisation
    }
  })

  const config = useRuntimeConfig()
  await createEmail({
    config,
    to: createdUser.email,
    subject: createEmailSubject(
      'Mon Suivi Social - Ouverture de votre compte',
      config
    ),
    ...getUserCreationEmailContent(createdUser)
  })

  return createdUser
}

export const addUserMutation = createMutation({
  securityCheck,
  inputValidation: createUserSchema,
  handler,
  auditLog: {
    key: 'user.create',
    target: UserActivityObject.User,
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
