import { getProConnectClient } from '~/server/lib'

export default defineEventHandler(event => {
  const client = getProConnectClient()
  const { redirectUrl } = getQuery(event)
  return sendRedirect(
    event,
    client.getSigninUrl(redirectUrl as string | undefined)
  )
})
