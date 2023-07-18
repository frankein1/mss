import { TRPCError } from '@trpc/server'
import { UserStatus, User } from '@prisma/client'
import { sendEmail } from '../lib/email/sendEmail'
import { getInclusionConnectClient } from '../lib'
import { signJwt, verifyJwt } from '~/server/lib/jwt'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type { UserEditionInput, UserCreationInput } from '~/server/schema'
import {
  canEditUser,
  canEditUserRole,
  canCreateUser,
  canListUsers
} from '~/server/security/rules'

export const updateUserHandler = async ({
  ctx: { user },
  input: { id, ...rest }
}: {
  ctx: ProtectedAppContext
  input: UserEditionInput
}) => {
  const target = await prismaClient.user.findUnique({ where: { id } })

  if (!target) {
    throw invalidError('User not found')
  }

  if (
    !canEditUser(user, target) ||
    ('role' in rest && !canEditUserRole(user, target, rest))
  ) {
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
  ctx: ProtectedAppContext
  input: UserCreationInput
}) => {
  if (!canCreateUser(user)) {
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
  ctx: ProtectedAppContext
}) => {
  if (!canListUsers(user)) {
    throw forbiddenError()
  }

  return await prismaClient.user.findMany({
    where: { structureId: user.structureId },
    orderBy: { role: 'asc' }
  })
}

export const acceptCGUHandler = async ({
  ctx: { user, event }
}: {
  ctx: ProtectedAppContext
}) => {
  const {
    public: { cguVersion, sessionCookieKey },
    auth: { jwtKey }
  } = useRuntimeConfig()

  const updatedUser = await prismaClient.user.update({
    where: { id: user.id },
    data: {
      CGUHistory: {
        create: {
          version: cguVersion
        }
      }
    },
    include: {
      CGUHistory: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  })

  const cookies = parseCookies(event)
  if (!cookies) {
    throw invalidError()
  }

  const previousSessionToken = cookies[sessionCookieKey]
  if (!previousSessionToken) {
    throw invalidError()
  }

  let payload
  try {
    payload = verifyJwt(previousSessionToken, jwtKey)
  } catch (err) {
    deleteCookie(event, sessionCookieKey)
    throw forbiddenError()
  }

  const { user: savedUser } = payload

  const newUser = {
    ...savedUser,
    CGUHistoryVersion: updatedUser.CGUHistory[0].version
  }

  event.context.auth = { newUser }

  const { sessionToken, expiresIn } = signJwt(newUser, jwtKey)
  setCookie(event, sessionCookieKey, sessionToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000)
  })

  return newUser
}

function getEmailContent(user: User) {
  const {
    public: {
      email: { from }
    }
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
