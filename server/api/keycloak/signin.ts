import { getInclusionConnectClient } from '~/server/lib'

export default defineEventHandler(event => {
  const client = getInclusionConnectClient()
  const { redirectUrl } = getQuery(event)
  return sendRedirect(
    event,
    client.getSigninUrl(redirectUrl as string | undefined)
  )
})
