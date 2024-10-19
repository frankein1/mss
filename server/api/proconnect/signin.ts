import { useSession } from 'h3'
import { v4 } from 'uuid'
import { getProConnectClient } from '~/server/lib'
import { AuthSession } from '~/server/types/session'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const redirectUrl = getQuery(event).redirectUrl as string | undefined

  const {
    auth: { sessionSecret }
  } = useRuntimeConfig()

  const session = await useSession<AuthSession>(event, {
    password: sessionSecret
  })

  const nonce = v4()
  const state = v4()

  await session.update(() => ({ nonce, state, redirectUrl }))

  return sendRedirect(event, client.getSigninUrl({ nonce, state }))
})
