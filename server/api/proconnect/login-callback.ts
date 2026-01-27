import type { Prisma } from '@prisma/client'
import { UserStatus, UserActivityType } from '@prisma/client'
import pkg from 'jsonwebtoken'
import { signJwt } from '~/server/lib/jwt'
import { getProConnectClient } from '~/server/lib/proconnect.client'
import type {
  ProConnectToken,
  ProConnectUserInfo,
  ProConnectClient
} from '~/server/lib/proconnect.client'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { cleanEmail } from '~/utils/user/cleanEmail'
import { includeOrderedCGUHistory } from '~/server/query'
import type { AuthSession } from '~/server/types/session'
import { forbidden, unauthorized } from '~/utils/api/errors'
import { structureContextQuery } from '~/server/trpc/createContext'
import { cookieOptions } from '~/utils/cookie'
import type { JwtUser } from '~/server/lib/jwt'
import { routes } from '~/utils/routes'

const { verify } = pkg

const {
  auth: {
    sessionSecret,
    proconnectProvider,
    proconnectLabel,
    proconnectIssuer,
    proconnectClientId,
    proconnectClientSecret,
    proconnectSigningAlgorithm,
    jwtKey
  },
  public: {
    mssEnvironment,
    auth: { cookieKey, tokenValidationInMinutes },
    appUrl
  }
} = useRuntimeConfig()

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

  // ProConnect tokens are signed with HS256
  const { accessToken, idToken } = proConnectToken

  // Validate id token signature
  // See https://curity.io/resources/learn/jwt-best-practices/ sections 3 to 6
  let validatedIdToken: { nonce: string; amr: string[] } | null = null

  try {
    validatedIdToken = verify(idToken, proconnectClientSecret, {
      algorithms: [proconnectSigningAlgorithm as pkg.Algorithm],
      audience: proconnectClientId,
      issuer: proconnectIssuer,
      nonce: sessionNonce
    }) as {
      nonce: string
      amr: string[]
    }
  } catch {
    throw unauthorized('[ProConnect] invalid id token')
  }

  const userinfo = await fetchUserInfo(client, accessToken)

  // Validate jwt user info signature
  let validatedUserInfo: ProConnectUserInfo | null = null
  try {
    validatedUserInfo = verify(userinfo, proconnectClientSecret, {
      algorithms: [proconnectSigningAlgorithm as pkg.Algorithm],
      audience: proconnectClientId,
      issuer: proconnectIssuer
    }) as ProConnectUserInfo
  } catch {
    throw unauthorized('[ProConnect] invalid user info')
  }

  if (!validatedUserInfo.email || !validatedUserInfo.sub) {
    throw forbidden('[ProConnect] missing email or sub')
  }

  const { email, sub } = validatedUserInfo

  const account = await getAccount({ sub })

  let user: UserAuthInfo | null = null
  if (account) {
    user = account.user
  } else {
    user = await getUser(email)
  }

  // If user has not been previously created through admin panel
  // forbid access and provide a logout link to retry in the error page
  if (!user) {
    await provideLogoutUrl(session, idToken, state)
    throw forbidden('[ProConnect] Access denied: unknown user')
  }

  // If user deactivated, provide a logout link to retry in the error page
  if (user.status !== UserStatus.Active) {
    await provideLogoutUrl(session, idToken, state)
    throw forbidden('[ProConnect] Access denied: deactivated user')
  }

  // If structure disabled, provide a logout link to retry in the error page
  if (user.structure && user.structure.disabled) {
    await provideLogoutUrl(session, idToken, state)
    throw forbidden('[ProConnect] Access denied: deactivated structure')
  }

  // Check 2FA presence when authenticating as an admin
  if (user.role === 'Administrator') {
    const emailIsValid =
      mssEnvironment === 'local' ||
      user.email.endsWith('@beta.gouv.fr') ||
      user.email.endsWith('@ext.anct.gouv.fr')

    // If already authenticated, going through login flow does not fill amr field and entails 403.
    // This is mitigated by :
    // - redirecting to admin panel when admin is already logged in (via a skip auth middleware)
    // - providing a proconnect-only logout link in the error page for backup
    const authenticationModes = (validatedIdToken?.amr || []) as string[]

    if (!emailIsValid) {
      const logoutUrl = client.getLogoutUrl({ idToken, state })
      await session.update({ logoutUrl })
      throw forbidden('[ProConnect] Access denied')
    }

    if (!authenticationModes.includes('mfa')) {
      const logoutUrl = client.getLogoutUrl({ idToken, state })
      await session.update({ logoutUrl })
      throw forbidden('[ProConnect] Access denied: MFA necessary')
    }
  }

  // Update account with session information: idToken and state will be needed for logout
  await upsertAccount({
    providerAccountId: sub,
    user,
    proConnectToken,
    state: state as string
  })

  // Update email information with current proconnect info. This allows to update the email
  // of the user when she changes her proconnect account (when proconnect allow email change)
  if (user.email !== email) {
    //console.log('updating email', JSON.stringify(user, undefined, 2))
    updateEmail(user.id, email)
  }

  // Generate MSS token
  const {
    firstName,
    lastName,
    id,
    role,
    status,
    CGUHistory,
    structure,
    firstAccess
  } = user

  const CGUHistoryVersion = CGUHistory[0]?.version || null

  const jwtUser: JwtUser = {
    firstName,
    lastName,
    id,
    email,
    role,
    status,
    structureId: structure?.id || null,
    CGUHistoryVersion,
    structureType: structure?.type || null
  }

  // Create auth mss token
  const sessionToken = signJwt(jwtUser, jwtKey, tokenValidationInMinutes)

  const now = new Date()
  const data: Prisma.UserUpdateInput = {
    ...(!firstAccess && { firstAccess: now }),
    lastAccess: now
  }

  // The admin role is not linked to a structure so check is necessary
  if (user.structure) {
    data.structure = {
      update: {
        lastAccess: now,
        deactivationAlertEmail: 0,
        deactivationAlertEmailDate: null
      }
    }
  }

  await UserRepo.prisma.update({
    where: {
      id: user.id
    },
    data
  })

  setCookie(
    event,
    cookieKey,
    sessionToken,
    cookieOptions({ expiresInMinutes: tokenValidationInMinutes })
  )

  // The login activities are traced in the DB
  await addUserActivity({
    key: 'auth.validateToken',
    user,
    activity: UserActivityType.LOGIN,
    object: 'User',
    objectId: user.id
  })

  // TODO: session should always be cleared or replaced with logouturl on failure
  await session.clear()

  // After successful login:
  // - redirect to specified url if exist
  // - redirect to admin panel if admin
  // - redirect to user panel otherwise
  // Fetching user information and permissions will be executed on first page loading with auth plugin
  if (redirectUrl) {
    return sendRedirect(event, `${appUrl}${redirectUrl}`)
  }

  if (user.role === 'Administrator') {
    return sendRedirect(event, routes.admin.AdminOverview.path())
  }

  return sendRedirect(event, routes.user.AppOverview.path())
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

const userSelect: { select: Prisma.UserSelect } = {
  select: {
    firstName: true,
    lastName: true,
    id: true,
    email: true,
    role: true,
    status: true,
    firstAccess: true,
    structureId: true,
    ...includeOrderedCGUHistory(),
    structure: {
      select: {
        ...structureContextQuery().select,
        disabled: true
      }
    }
  }
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
      user: userSelect
    }
  })
}

async function upsertAccount({
  user,
  providerAccountId,
  proConnectToken,
  state
}: {
  user: UserAuthInfo
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
    select: userSelect.select
  })
}

async function provideLogoutUrl(
  session: NitroSession,
  idToken: string,
  state: string
) {
  const client = getProConnectClient()
  const logoutUrl = client.getLogoutUrl({ idToken, state })
  await session.update({ logoutUrl })
}

type UserAuthInfo = NonNullable<Awaited<ReturnType<typeof getUser>>>
type NitroSession = Awaited<ReturnType<typeof useSession<AuthSession>>>
