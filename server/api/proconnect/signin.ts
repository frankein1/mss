import { useSession } from 'h3'
import { randomUUID } from 'node:crypto'
import { getProConnectClient } from '~~/server/lib'
import type { OAuthHandshake } from '~~/server/types/session'
import { isSafeRedirectUrl } from '~/utils/isSafeRedirectUrl'

export default defineEventHandler(async event => {
  const client = getProConnectClient()
  const uncheckedRedirectUrl = parseQuery(getQuery(event).redirectUrl)
  const isSafe = uncheckedRedirectUrl
    ? isSafeRedirectUrl(uncheckedRedirectUrl)
    : false

  if (uncheckedRedirectUrl && !isSafe) {
    console.log('[ProConnect] Rejected unsafe redirect URL at signin')
    event.context.sentry?.captureMessage(
      '[ProConnect] Rejected unsafe redirect URL at signin',
      {
        level: 'warning',
        extra: { redirectUrl: uncheckedRedirectUrl }
      }
    )
  }

  const redirectUrl = isSafe ? uncheckedRedirectUrl : undefined

  const {
    auth: { sessionSecret }
  } = useRuntimeConfig()

  const session = await useSession<OAuthHandshake>(event, {
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
  return Array.isArray(q) ? (q[0] as string | undefined) : undefined
}
