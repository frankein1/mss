import { Account, UserActivityType } from '@prisma/client'
import { getProConnectClient } from '~/server/lib'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { parseJwt } from '~/utils/parseJwt'

export default defineEventHandler(async event => {
  const { inactive } = getQuery(event)
  const config = useRuntimeConfig()

  const client = getProConnectClient()

  const { cookieKey } = config.public.auth

  const sessionToken = getCookie(event, cookieKey)

  if (!sessionToken) {
    return { success: true, url: null }
  }

  const { user: jwtUser } = parseJwt(sessionToken)
  const { email } = jwtUser
  const user = await findUser(email)

  deleteCookie(event, cookieKey)

  if (!user) {
    return { success: true, url: null }
  }

  await addUserActivity({
    key: 'auth.logout',
    user,
    activity: UserActivityType.LOGOUT,
    object: 'User',
    objectId: user.id
  })

  const account = await prismaClient.account.findFirst({
    where: {
      userId: user.id,
      provider: config.auth.proconnectProvider
    }
  })
  if (!account) {
    return { success: true, url: null }
  }

  await updateAccount(account)

  const logoutUrl = client.getLogoutUrl({
    idToken: account.idToken || '',
    state: account.sessionState || ''
  })
  const url = inactive ? `${logoutUrl}?inactive` : logoutUrl

  return { success: true, url }
})

async function findUser(email: string) {
  try {
    return await UserRepo.prisma.findUniqueOrThrow({ where: { email } })
  } catch (err) {
    // FIXME: Remove log once error is identified
    console.error('[Keycloak Logout] User not found...', { email })
    throw err
  }
}

async function updateAccount(account: Account) {
  await prismaClient.account.update({
    where: { id: account.id },
    data: {
      accessToken: null,
      expiresAt: null,
      refreshToken: null,
      tokenType: null,
      idToken: null,
      scope: null
    }
  })
}
