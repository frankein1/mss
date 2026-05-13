import { useSession } from 'h3'
import { randomUUID } from 'node:crypto'
import { getProConnectClient } from '~/server/lib'
import type { AuthSession } from '~/server/types/session'
import { isSafeRedirectUrl } from '~/utils/isSafeRedirectUrl'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const unckechedRedirectUrl = parseQuery(getQuery(event).redirectUrl)
  const redirectUrl =
    unckechedRedirectUrl && isSafeRedirectUrl(unckechedRedirectUrl)
      ? unckechedRedirectUrl
      : undefined

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

function parseQuery(q: ReturnType<typeof getQuery<unknown>>['x']) {
  if (typeof q === 'string') {
    return q
  }
  return Array.isArray(q) ? (q[0] as string) : undefined
}
