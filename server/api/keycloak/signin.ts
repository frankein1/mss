import { getInclusionConnectClient } from '~/server/lib'

export default defineEventHandler(event => {
  const client = getInclusionConnectClient()

  return sendRedirect(event, client.getSigninUrl())
})
