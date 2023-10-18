import { Account, UserActivityType } from '@prisma/client'
import { getInclusionConnectClient } from '~/server/lib'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UserRepo } from '~/server/database'
import { parseJwt } from '~/utils/parseJwt'

export default defineEventHandler(async event => {
  const { inactive } = getQuery(event)
  const config = useRuntimeConfig()

  const client = getInclusionConnectClient()

  const sessionCookieKey = config.public.sessionCookieKey

  const sessionToken = getCookie(event, sessionCookieKey)

  if (!sessionToken) {
    return { success: true, url: null }
  }

  const { user: jwtUser } = parseJwt(sessionToken)
  const { email } = jwtUser
  const user = await findUser(email)

  deleteCookie(event, sessionCookieKey)

  if (!user) {
    return { success: true, url: null }
  }

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.LOGOUT,
    object: 'User',
    objectId: user.id
  })

  const account = await prismaClient.account.findFirst({
    where: {
      userId: user.id,
      provider: config.auth.keycloakProvider
    }
  })
  if (!account) {
    return { success: true, url: null }
  }

  await updateAccount(account)

  const url = client.getLogoutUrl(account.idToken || '', !!inactive)
  return { success: false, url }
})

async function findUser(email: string) {
  return await UserRepo.prisma.findUniqueOrThrow({ where: { email } })
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
