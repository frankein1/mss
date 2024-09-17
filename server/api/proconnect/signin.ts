import { useSession } from 'h3'
import { v4 } from 'uuid'
import { getProConnectClient } from '~/server/lib'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const { redirectUrl } = getQuery(event)
  const session = await useSession<{ nonce: string; state: string }>(event, {
    password: 'sessionPasswordsessionPasswordsessionPassword'
  })
  const nonce = v4()
  const state = v4()

  await session.update(() => ({ nonce, state }))

  return sendRedirect(
    event,
    client.getSigninUrl({
      appRedirectUrl: redirectUrl as string | undefined,
      nonce,
      state
    })
  )
})
