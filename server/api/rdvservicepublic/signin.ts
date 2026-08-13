import { useSession } from 'h3'
import { randomUUID } from 'node:crypto'
import type { RdvspAuthSession } from '~~/server/types/session'
import { getConfig, authorize } from '~~/server/lib/rdvsp-oauth.client'

/** RDVSP signin endpoint called by MSS frontend
 * Not managed with trpc because it handles redirection
 * see: https://discord-questions.trpc.io/m/1084901636146729020
 *
 * Query params:
 * - action: name of trpc function to execute after login
 * - id: trpc function argument
 */
export default defineEventHandler(async event => {
  const { auth } = useRuntimeConfig()
  const { action, id } = getQuery(event)

  const session = await useSession<RdvspAuthSession>(event, {
    password: auth.sessionSecret
  })

  const nonce = randomUUID()
  const state = randomUUID()

  await session.update(() => ({ nonce, state, metadata: { action, id } }))

  return sendRedirect(event, authorize(getConfig(), nonce, state))
})
