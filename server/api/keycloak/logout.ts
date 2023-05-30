import { Account } from '@prisma/client'
import { H3Event } from 'h3'
import { getInclusionConnectClient } from '~/server/lib'
import { prismaClient } from '~/server/prisma'
import { parseJwt } from '~/utils/parseJwt'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  const sessionCookieKey = config.public.sessionCookieKey

  const sessionToken = getCookie(event, sessionCookieKey)

  const client = getInclusionConnectClient()

  if (!sessionToken) {
    return redirect(event, client.getPostLogoutRedirectUri())
  }

  const { user: jwtUser } = parseJwt(sessionToken)
  const { email } = jwtUser
  const user = await findUser(email)

  deleteCookie(event, sessionCookieKey)

  if (!user) {
    return redirect(event, client.getPostLogoutRedirectUri())
  }

  const account = await prismaClient.account.findUniqueOrThrow({
    where: {
      provider_providerAccountId: {
        provider: config.auth.keycloakProvider,
        providerAccountId: jwtUser.inclusionConnectId
      }
    }
  })
  if (!account) {
    return redirect(event, client.getPostLogoutRedirectUri())
  }

  await updateAccount(account)

  const signoutUrl = client.getLogoutUrl(
    account.sessionState || '',
    account.idToken || ''
  )

  await fetch(signoutUrl)

  return sendRedirect(event, client.getPostLogoutRedirectUri())
})

function redirect(event: H3Event, location: string) {
  return sendRedirect(event, location)
}

async function findUser(email: string) {
  return await prismaClient.user.findUniqueOrThrow({ where: { email } })
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
      sessionState: null,
      scope: null
    }
  })
}
