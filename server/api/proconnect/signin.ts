import { useSession } from 'h3'
import { randomUUID } from 'node:crypto'
import { getProConnectClient } from '~/server/lib'
import type { AuthSession } from '~/server/types/session'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const redirectUrl = getQuery(event).redirectUrl as string | undefined

  const {
    auth: { sessionSecret }
  } = useRuntimeConfig()

  const session = await useSession<AuthSession>(event, {
    password: sessionSecret
  })

  const nonce = randomUUID()
  const state = randomUUID()

  await session.update(() => ({ nonce, state, redirectUrl }))

  return sendRedirect(event, client.getSigninUrl({ nonce, state }))
})
