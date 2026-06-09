import { UserActivityType } from '@prisma/client'
import { getProConnectClient } from '~/server/lib'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import type { H3Event } from 'h3'
import { unauthorized } from '~/utils/api/errors'
import { fetchUserContext } from '~/server/utils/fetchUserContext'

export default defineEventHandler(async event => {
  const { inactive } = getQuery(event)

  const {
    auth: { proconnectProvider },
    public: {
      auth: { cookieKey }
    }
  } = useRuntimeConfig()

  const userId = deleteMSSToken(event, cookieKey)

  try {
    const user = await fetchUserContext(userId)
    addUserActivity({
      key: 'auth.logout',
      user,
      activity: UserActivityType.LOGOUT,
      object: 'User',
      objectId: user.id
    }).catch(error => console.error(error))
  } catch (error) {
    console.error('logout: failed to log user activity', error)
  }

  const account = await cleanAccountData(userId, proconnectProvider)

  const client = getProConnectClient()
  const logoutUrl = client.getLogoutUrl({
    idToken: account.idToken || '',
    state: account.sessionState || ''
  })

  const url = inactive ? `${logoutUrl}?inactive` : logoutUrl

  return sendRedirect(event, url)
})

function deleteMSSToken(event: H3Event, cookieKey: string) {
  const userId = event.context.auth?.userId
  if (!userId) {
    throw unauthorized('[ProConnect] Logout failure: missing data')
  }

  deleteCookie(event, cookieKey)

  return userId
}

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
      idToken: null,
      sessionState: null
    }
  })

  return accounts[0]
}
