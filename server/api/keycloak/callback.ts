import { User } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { parseInclusionConnectJwt } from '~/server/lib'
import {
  getInclusionConnectClient,
  InclusionConnectClient,
  InclusionConnectToken
} from '~/server/lib/inclusion-connect.client'
import { signJwt } from '~/server/lib/jwt'
import { Routes } from '~/utils/routing/routes'

const config = useRuntimeConfig()
const { sessionCookieKey, inclusionConnect } = config.public
const { provider, type } = inclusionConnect
const jwtKey = config.private.jwtKey

export default defineEventHandler(async event => {
  const { code } = getQuery(event)

  if (!code) {
    return sendError(
      event,
      new Error(`[IC] no code returned from InclusionConnect`)
    )
  }

  const client = getInclusionConnectClient()

  const inclusionConnectToken = await fetchInclusionConnnectToken(
    client,
    code as string
  )

  const { accessToken } = inclusionConnectToken
  const { email, sub } = parseInclusionConnectJwt(accessToken)

  const user = await getUser(email)

  // [NUXT/PRISMA]: Redirect when error
  if (!user) {
    return sendError(event, new Error(`[IC] No user found with email ${email}`))
  }

  // upsert account
  await upsertAccount({
    providerAccountId: sub,
    user,
    inclusionConnectToken
  })

  const { firstName, lastName, id, role, structure, status } = user

  const jwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    inclusionConnectId: sub,
    structureId: structure?.id || null,
    structureType: structure?.type
  }

  const { sessionToken, expiresIn } = signJwt(jwtUser, jwtKey)

  // Set sessionToken in Cookie
  setCookie(event, sessionCookieKey, sessionToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresIn * 1000)
  })

  return sendRedirect(event, Routes.Overview) // [NUXT/PRISMA]: Redirect depending on the redirect url in query params ?
})

async function fetchInclusionConnnectToken(
  client: InclusionConnectClient,
  code: string
) {
  const inclusionConnectTokenResponse = await client.getToken({
    code
  })

  if (inclusionConnectTokenResponse.error) {
    throw new Error(`[IC] ${inclusionConnectTokenResponse.error.description}`)
  }
  if (!inclusionConnectTokenResponse.data) {
    throw new Error(`[IC] no access token found un inclusion connect response`)
  }

  return inclusionConnectTokenResponse.data
}

async function upsertAccount({
  user,
  providerAccountId,
  inclusionConnectToken
}: {
  user: User
  providerAccountId: string
  inclusionConnectToken: InclusionConnectToken
}) {
  const {
    accessToken,
    expiresIn,
    refreshToken,
    tokenType,
    idToken,
    sessionState,
    scope
  } = inclusionConnectToken

  return await prismaClient.account.upsert({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    create: {
      userId: user.id,
      type,
      provider,
      providerAccountId,
      accessToken,
      expiresAt: expiresIn,
      refreshToken,
      tokenType,
      idToken,
      sessionState,
      scope
    },
    update: {
      accessToken,
      expiresAt: expiresIn,
      refreshToken,
      tokenType,
      idToken,
      sessionState,
      scope
    }
  })
}

async function getUser(email: string) {
  return await prismaClient.user.findUniqueOrThrow({
    where: { email },
    include: {
      structure: true
    }
  })
}
