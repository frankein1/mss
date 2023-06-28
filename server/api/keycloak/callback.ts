import { User } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { parseInclusionConnectJwt } from '~/server/lib'
import {
  getInclusionConnectClient,
  InclusionConnectClient,
  InclusionConnectToken
} from '~/server/lib/inclusion-connect.client'
import { signJwt } from '~/server/lib/jwt'
import { RoutePath } from '~/utils/routing'

const config = useRuntimeConfig()
const {
  public: { sessionCookieKey },
  auth
} = config

const { keycloakProvider, keycloakLabel, jwtKey } = auth

export default defineEventHandler(async event => {
  const { code, redirectUrl } = getQuery(event)

  if (!code) {
    return sendError(
      event,
      new Error('[IC] no code returned from InclusionConnect')
    )
  }

  const client = getInclusionConnectClient()

  const inclusionConnectToken = await fetchInclusionConnnectToken(
    client,
    code as string,
    redirectUrl as string | undefined
  )

  const { idToken } = inclusionConnectToken
  const { email, sub } = parseInclusionConnectJwt(idToken)

  const user = await getUser(email)

  // [NUXT/PRISMA]: Redirect when error
  // TODO: Unknown user page
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

  return sendRedirect(
    event,
    (redirectUrl as string | undefined) || RoutePath.Overview()
  )
})

async function fetchInclusionConnnectToken(
  client: InclusionConnectClient,
  code: string,
  appRedirectUrl: string | undefined
) {
  const inclusionConnectTokenResponse = await client.getToken({
    code,
    appRedirectUrl
  })

  if (inclusionConnectTokenResponse.error) {
    throw new Error(`[IC] ${inclusionConnectTokenResponse.error.description}`)
  }
  if (!inclusionConnectTokenResponse.data) {
    throw new Error('[IC] no access token found un inclusion connect response')
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
  const { accessToken, expiresIn, refreshToken, tokenType, idToken, scope } =
    inclusionConnectToken

  return await prismaClient.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: keycloakProvider,
        providerAccountId
      }
    },
    create: {
      userId: user.id,
      type: keycloakLabel,
      provider: keycloakProvider,
      providerAccountId,
      accessToken,
      expiresAt: expiresIn,
      refreshToken,
      tokenType,
      idToken,
      scope
    },
    update: {
      accessToken,
      expiresAt: expiresIn,
      refreshToken,
      tokenType,
      idToken,
      scope
    }
  })
}

async function getUser(email: string) {
  try {
    return await prismaClient.user.findUniqueOrThrow({
      where: { email },
      include: {
        structure: true
      }
    })
  } catch {
    return null
  }
}
