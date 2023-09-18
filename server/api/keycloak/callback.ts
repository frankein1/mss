import { v4 } from 'uuid'
import { User } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { parseInclusionConnectJwt } from '~/server/lib'
import {
  getInclusionConnectClient,
  InclusionConnectClient,
  InclusionConnectToken
} from '~/server/lib/inclusion-connect.client'
import { RoutePath } from '~/utils/routing'

const config = useRuntimeConfig()
const { auth } = config

const { keycloakProvider, keycloakLabel } = auth

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

  const user = await getUser(email.toLowerCase())

  const { appUrl } = config.public

  if (!user) {
    const unknownUserUrl = `${appUrl}${RoutePath.ErrorUnknownUser()}`
    return sendRedirect(event, unknownUserUrl)
  }

  // upsert account
  await upsertAccount({
    providerAccountId: sub,
    user,
    inclusionConnectToken
  })

  const userAccessToken = v4()

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      accessToken: userAccessToken,
      accessTokenValidity: new Date(Date.now() + 60 * 10 * 1000)
    }
  })

  let validateTokenUrl = `${appUrl}${RoutePath.AuthValidateToken()}?token=${userAccessToken}`
  if (redirectUrl) {
    validateTokenUrl = `${validateTokenUrl}&redirectUrl=${redirectUrl}`
  }

  return sendRedirect(event, validateTokenUrl)
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
        structure: true,
        CGUHistory: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })
  } catch {
    return null
  }
}
