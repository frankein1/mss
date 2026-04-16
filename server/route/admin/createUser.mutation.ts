import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { createEmail } from '~/server/query'
import type { AdminCreateUserInput } from '~/server/schema'
import { adminCreateUserSchema } from '~/server/schema'
import { getUserCreationEmailContent } from '~/server/email'
import { UserRepo } from '~/server/database'
import type { AdminContext } from '~/server/trpc'
import { cleanEmail } from '~/utils/user'
import { createEmailSubject } from '~/server/email/createEmailSubject'
import { createOrUpdateUser } from '~/server/integrations/brevo/service'
import { UserActivityType } from '@prisma/client'

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
    },
    include: {
      structure: {
        select: { siret: true }
      }
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
  // Do not await, as this should not make the user creation fail in case of failure
  createOrUpdateUser(createdUser.id).catch(error => console.error(error))

  return createdUser
}

export const createUser = createMutation({
  inputValidation: adminCreateUserSchema,
  adminHandler,
  auditLog: {
    key: 'admin.user.create',
    target: 'User',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
