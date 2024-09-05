import { v4 } from 'uuid'
import { User } from '@prisma/client'
import { parseProConnectJwt } from '~/server/lib'
import {
  getProConnectClient,
  ProConnectClient,
  ProConnectToken
} from '~/server/lib/proconnect.client'
import { routes } from '~/utils/routes'
import { UserRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { cleanEmail } from '~/utils/user/cleanEmail'
import { includeOrderedCGUHistory } from '~/server/query'

const config = useRuntimeConfig()
const { auth } = config

const { proconnectProvider, proconnectLabel } = auth

export default defineEventHandler(async event => {
  const { code, redirectUrl } = getQuery(event)

  if (!code) {
    throw createError({
      statusCode: 400,
      message: '[IC] no code returned from ProConnect'
    })
  }

  const client = getProConnectClient()

  const proConnectToken = await fetchProConnnectToken(
    client,
    code as string,
    redirectUrl as string | undefined
  )

  const { idToken } = proConnectToken
  const { email, sub } = parseProConnectJwt(idToken)

  const user = await getUser(email.toLowerCase())

  const { appUrl } = config.public

  if (!user) {
    const unknownUserUrl = `${appUrl}${routes.error.ErrorUnknownUser.path()}`
    return sendRedirect(event, unknownUserUrl)
  }

  // upsert account
  await upsertAccount({
    providerAccountId: sub,
    user,
    proConnectToken
  })

  const userAccessToken = v4()

  await UserRepo.prisma.update({
    where: { id: user.id },
    data: {
      accessToken: userAccessToken,
      accessTokenValidity: new Date(Date.now() + 60 * 10 * 1000)
    }
  })

  let validateTokenUrl = `${appUrl}${routes.auth.AuthValidateToken.path()}?token=${userAccessToken}`
  if (redirectUrl) {
    validateTokenUrl = `${validateTokenUrl}&redirectUrl=${redirectUrl}`
  }

  return sendRedirect(event, validateTokenUrl)
})

async function fetchProConnnectToken(
  client: ProConnectClient,
  code: string,
  appRedirectUrl: string | undefined
) {
  const proConnectTokenResponse = await client.getToken({
    code,
    appRedirectUrl
  })

  if (proConnectTokenResponse.error) {
    throw new Error(`[IC] ${proConnectTokenResponse.error.description}`)
  }
  if (!proConnectTokenResponse.data) {
    throw new Error('[IC] no access token found un pro connect response')
  }

  return proConnectTokenResponse.data
}

async function upsertAccount({
  user,
  providerAccountId,
  proConnectToken
}: {
  user: User
  providerAccountId: string
  proConnectToken: ProConnectToken
}) {
  const { accessToken, expiresIn, refreshToken, tokenType, idToken, scope } =
    proConnectToken

  return await prismaClient.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: proconnectProvider,
        providerAccountId
      }
    },
    create: {
      userId: user.id,
      type: proconnectLabel,
      provider: proconnectProvider,
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
  return await UserRepo.prisma.findUnique({
    where: { email: cleanEmail(email) },
    include: {
      structure: true,
      ...includeOrderedCGUHistory()
    }
  })
}
