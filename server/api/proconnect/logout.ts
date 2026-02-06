import { UserActivityType } from '@prisma/client'
import { getProConnectClient } from '~/server/lib'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { unauthorized } from '~/utils/api/errors'
import { setAuthenticatedContext } from '~/server/auth/auth-middleware'

export default defineEventHandler({
  onRequest: [setAuthenticatedContext],
  handler: async event => {
    const user = event.context.auth?.user
    if (!user) {
      throw unauthorized('[ProConnect] Logout failure: missing data')
    }

    const { inactive } = getQuery(event)

    const {
      auth: { proconnectProvider },
      public: {
        auth: { cookieKey }
      }
    } = useRuntimeConfig()

    deleteCookie(event, cookieKey)

    await addUserActivity({
      key: 'auth.logout',
      user,
      activity: UserActivityType.LOGOUT,
      object: 'User',
      objectId: user.id
    })

    const account = await cleanAccountData(user.id, proconnectProvider)

    const client = getProConnectClient()
    const logoutUrl = client.getLogoutUrl({
      idToken: account.idToken || '',
      state: account.sessionState || ''
    })

    const url = inactive ? `${logoutUrl}?inactive` : logoutUrl

    return sendRedirect(event, url)
  }
})

async function cleanAccountData(userId: string, proconnectProvider: string) {
  const accounts = await prismaClient.account.findMany({
    where: {
      userId,
      provider: proconnectProvider
    },
    select: {
      id: true,
      providerAccountId: true,
      idToken: true,
      sessionState: true
    }
  })

  if (!accounts[0]) {
    throw unauthorized('[ProConnect] Logout failure: missing data')
  }
  if (accounts.length > 1) {
    // TODO: send to sentry duplicate account. Due to changed email in admin panel ?
    console.log(
      'duplicate proconnect accounts',
      JSON.stringify(accounts.map(a => a.providerAccountId))
    )
    throw unauthorized('[ProConnect] Logout failure: duplicate accounts')
  }

  await prismaClient.account.update({
    where: { id: accounts[0].id },
    data: {
      accessToken: null,
      expiresAt: null,
      refreshToken: null,
      tokenType: null,
      idToken: null,
      scope: null
    }
  })

  return accounts[0]
}
