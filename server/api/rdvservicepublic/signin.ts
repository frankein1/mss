import { useSession } from 'h3'
import { v4 } from 'uuid'
import { AuthSession } from '~/server/types/session'
import { getConfig, authorize } from '~/server/lib/rdvsp-oauth.client'

const { auth } = useRuntimeConfig()

export default defineEventHandler(async event => {
  console.log('in rdvsp server signin route')
  const session = await useSession<AuthSession>(event, {
    password: auth.sessionSecret
  })

  const nonce = v4()
  const state = v4()

  await session.update(() => ({ nonce, state }))

  return sendRedirect(event, authorize(getConfig(), nonce, state))
})
