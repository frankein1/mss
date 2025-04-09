import { v4 } from 'uuid'
import { User } from '@prisma/client'
import { decode } from 'jsonwebtoken'
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
import { AuthSession } from '~/server/types/session'
import { forbidden, unauthorized } from '~/utils/api/errors'

const config = useRuntimeConfig()
const { auth } = config

const { proconnectProvider, proconnectLabel } = auth

// TODO: throw all errors at the same time
// add server messages & client messages
// always clear session

export default defineEventHandler(async event => {
  const { code, state } = getQuery(event)

  if (!code) {
    throw unauthorized('[ProConnect] no code returned from ProConnect')
  }
  if (!state) {
    throw unauthorized('[ProConnect] no state returned from ProConnect')
  }

  const {
    auth: { sessionSecret }
  } = useRuntimeConfig()

  const session = await useSession<AuthSession>(event, {
    password: sessionSecret
  })

  const { nonce: sessionNonce, state: sessionState, redirectUrl } = session.data

  if (!sessionNonce || !sessionState) {
    throw unauthorized('[ProConnect] state or nonce are not in session')
  }

  if (sessionState !== state) {
    throw unauthorized('[ProConnect] `states` must be equal')
  }

  const client = getProConnectClient()

  const proConnectToken = await fetchProConnnectToken(client, code as string)

  const token = proConnectToken
  const { accessToken, idToken } = token

  const payload = decode(idToken, {
    json: true
  })

  const nonce = payload?.nonce

  if (sessionNonce !== nonce) {
    throw unauthorized('[ProConnect] `nonces` must be equal')
  }

  const { email, sub, custom } = await fetchUserInfo(client, accessToken)

  const account = await getAccount({ sub })

  let user: User | null = null
  if (account) {
    user = account.user
  } else {
    user = await getUser(email)
  }

  const { appUrl, mssEnvironment } = config.public

  // If user has not been previously created through admin panel
  // forbid access and provide a logout link to retry in the error page
  if (!user) {
    const logoutUrl = client.getLogoutUrl({ idToken, state })
    await session.update({ logoutUrl })
    throw forbidden('[ProConnect] Access denied: unknown user')
  }

  // Check 2FA presence when authenticating as an admin
  if (user.role === 'Administrator') {
    const emailIsValid =
      mssEnvironment === 'local' || user.email.endsWith('@beta.gouv.fr')
    const emailIsVerified =
      mssEnvironment === 'local' || Boolean(custom?.email_verified)

    // If already authenticated, going through login flow does not fill amr field and entails 403.
    // This is mitigated by providing a proconnect-only logout link in the error page
    const authenticationModes = (payload?.amr || []) as string[]
    const hasMFA =
      authenticationModes.includes('pwd') && authenticationModes.includes('mfa')

    if (!emailIsValid || !emailIsVerified) {
      const logoutUrl = client.getLogoutUrl({ idToken, state })
      await session.update({ logoutUrl })
      throw forbidden('[ProConnect] Access denied')
    }

    if (!hasMFA) {
      const logoutUrl = client.getLogoutUrl({ idToken, state })
      await session.update({ logoutUrl })
      throw forbidden('[ProConnect] Access denied: MFA necessary')
    }
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

  let validateTokenUrl = `${appUrl}${routes.auth.AuthValidateToken.path()}?token=${userAccessToken}&provider=proconnect`
  if (redirectUrl) {
    validateTokenUrl = `${validateTokenUrl}&redirectUrl=${redirectUrl}`
  }

  await session.clear()

  return sendRedirect(event, validateTokenUrl)
})

async function fetchUserInfo(client: ProConnectClient, accessToken: string) {
  const response = await client.getUserInfo({
    accessToken
  })
  return response
}

async function fetchProConnnectToken(client: ProConnectClient, code: string) {
  const proConnectTokenResponse = await client.getToken({ code })

  if (proConnectTokenResponse.error) {
    throw new Error(`[ProConnect] ${proConnectTokenResponse.error.description}`)
  }
  if (!proConnectTokenResponse.data) {
    throw new Error(
      '[ProConnect] no access token found un pro connect response'
    )
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
