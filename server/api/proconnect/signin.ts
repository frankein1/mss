import { useSession } from 'h3'
import { randomUUID } from 'node:crypto'
import { getProConnectClient } from '~/server/lib'
import type { AuthSession } from '~/server/types/session'
import { isSafeRedirectUrl } from '~/utils/isSafeRedirectUrl'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const unckechedRedirectUrl = parseQuery(getQuery(event).redirectUrl)
  const isSafe = unckechedRedirectUrl
    ? isSafeRedirectUrl(unckechedRedirectUrl)
    : false

  if (unckechedRedirectUrl && !isSafe) {
    console.log('[ProConnect] Rejected unsafe redirect URL at signin')
    event.context.sentry.captureMessage(
      '[ProConnect] Rejected unsafe redirect URL at signin',
      {
        level: 'warning',
        extra: { redirectUrl: unckechedRedirectUrl }
      }
    )
  }

  const redirectUrl = isSafe ? unckechedRedirectUrl : undefined

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
