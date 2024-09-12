import { v4 } from 'uuid'
import { User } from '@prisma/client'
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
  const { code, redirectUrl, state } = getQuery(event)

  if (!code) {
    throw createError({
      statusCode: 400,
      message: '[IC] no code returned from ProConnect'
    })
  }
  if (!state) {
    throw createError({
      statusCode: 400,
      message: '[IC] no state returned from ProConnect'
    })
  }

  // TODO: Vérifier que le champ state récupéré en query parameter correspond bien au state généré précédemment et stocké dans la session du navigateur.

  const client = getProConnectClient()

  const proConnectToken = await fetchProConnnectToken(
    client,
    code as string,
    redirectUrl as string | undefined
  )

  const token = proConnectToken
  const { accessToken } = token

  // TODO: Vérification de l'id_token et du nonce

  // TODO: Stockage du id_token

  const { email, sub } = await fetchUserInfo(client, accessToken)

  // TODO: Le endpoint user_info_endpoint renvoie un JWT, signé avec l'algorithme spécifié à AgentConnect lors de l'enregistrement du FS (RS256, ES256 ou HS256).
  // Vérifier que le JWT est bien signé avec cet algorithme.
  // Une fois en possession des informations de votre utilisateur, vous pouvez gérer comme vous le souhaitez sa session.

  const account = await getAccount({ sub })

  let user: User | null = null
  if (account) {
    user = account.user
  } else {
    user = await getUser(email)
  }

  const { appUrl } = config.public

  if (!user) {
    const unknownUserUrl = `${appUrl}${routes.error.ErrorUnknownUser.path()}`
    return sendRedirect(event, unknownUserUrl)
  }

  // upsert account
  await upsertAccount({
    providerAccountId: sub,
    user,
    proConnectToken,
    state: state as string
  })

  if (user.email !== email) {
    updateEmail(user.id, email)
  }

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

async function fetchUserInfo(client: ProConnectClient, accessToken: string) {
  const response = await client.getUserInfo({
    accessToken
  })
  return response
}

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

async function updateEmail(userId: string, email: string) {
  return await prismaClient.user.update({
    where: { id: userId },
    data: {
      email
    }
  })
}

async function getAccount({ sub }: { sub: string }) {
  return await prismaClient.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: proconnectProvider,
        providerAccountId: sub
      }
    },
    select: {
      user: true
    }
  })
}

async function upsertAccount({
  user,
  providerAccountId,
  proConnectToken,
  state
}: {
  user: User
  providerAccountId: string
  proConnectToken: ProConnectToken
  state: string
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
      scope,
      sessionState: state
    },
    update: {
      accessToken,
      expiresAt: expiresIn,
      refreshToken,
      tokenType,
      idToken,
      scope,
      sessionState: state
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
