import { TRPCError } from '@trpc/server'
import { UserRole, UserStatus, User } from '@prisma/client'
import { sendEmail } from '../lib/email/sendEmail'
import { getInclusionConnectClient } from '../lib'
import { AppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type { UserEditionInput, UserCreationInput } from '~/server/schema'
import { canEditUser } from '~/server/security/rules'

export const getUserInfoHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  return await prismaClient.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { structure: true }
  })
}

export const updateUserHandler = async ({
  ctx: { user },
  input: { id, ...rest }
}: {
  ctx: AppContext
  input: UserEditionInput
}) => {
  const target = await prismaClient.user.findUnique({ where: { id } })

  if (!target || !canEditUser(user, target)) {
    throw forbiddenError()
  }
  if ('status' in rest) {
    return await prismaClient.user.update({
      where: { id },
      data: { status: rest.status ? UserStatus.Active : UserStatus.Disabled }
    })
  }
  return await prismaClient.user.update({ where: { id }, data: rest })
}

export const addUserHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: UserCreationInput
}) => {
  // [NUXT/PRISMA]: Factorise with rules
  if (user.role !== UserRole.StructureManager) {
    throw forbiddenError()
  }

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
    data: {
      structureId: user.structureId,
      ...input
    }
  })

  sendEmail({
    to: createdUser.email,
    subject: 'Mon Suivi Social | Ouverture de votre compte',
    html: getEmailContent(createdUser)
  })

  return createdUser
}

export const getUsersHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  // [NUXT/PRISMA]: Factorise with rules
  if (user.role !== UserRole.StructureManager) {
    throw forbiddenError()
  }
  return await prismaClient.user.findMany({
    where: { structureId: user.structureId },
    orderBy: { role: 'asc' }
  })
}

function getEmailContent(user: User) {
  const {
    email: { from }
  } = useRuntimeConfig()

  const client = getInclusionConnectClient()
  const registrationUrl = client.getRegistrationUrl()

  const content = `Bonjour,
</br></br></br>
  Votre responsable de structure ou l'équipe de Mon Suivi Social vous a ouvert des accès à l'application Mon Suivi Social.
</br></br>
Pour s'authentifier, Mon Suivi Social utilise l'outil Inclusion Connect.
</br></br>
Afin d'accéder à l'application, veuillez créer un compte InclusionConnect en utilisant <b>${user.email}</b> comme adresse e-mail.
</br></br>
<a href=${registrationUrl}>Créer son compte Inclusion Connect</a>
</br></br>
En cas de difficulté, contactez-nous à ${from}.
</br></br></br>
L'équipe de Mon Suivi Social`

  return content
}
