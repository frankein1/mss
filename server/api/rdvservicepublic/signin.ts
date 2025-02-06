import { useSession } from 'h3'
import { v4 } from 'uuid'
import { RdvspAuthSession } from '~/server/types/session'
import { oauth } from '~/server/lib/rdvsp'

const { auth } = useRuntimeConfig()

/** RDVSP signin endpoint called by MSS frontend
 * Not managed with trpc because it handles redirection
 * see: https://discord-questions.trpc.io/m/1084901636146729020
 *
 * Query params:
 * - action: name of trpc function to execute after login
 * - id: trpc function argument
 */
export default defineEventHandler(async event => {
  const { action, id } = getQuery(event)

  const session = await useSession<RdvspAuthSession>(event, {
    password: auth.sessionSecret
  })

  const nonce = v4()
  const state = v4()

  await session.update(() => ({ nonce, state, metadata: { action, id } }))

  return sendRedirect(event, oauth.authorize(oauth.getConfig(), nonce, state))
})
