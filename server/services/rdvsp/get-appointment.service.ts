import type { ProtectedAppContext } from '~/server/trpc'
import { getAgentClient } from './helper'
import type { RdvspRdv } from '~/server/lib/rdvsp-oauth.client'

export default async function getAppointment({
  input,
  ctx
}: {
  input: { id: number }
  ctx: ProtectedAppContext
}) {
  const agentClient = await getAgentClient({ user_id: ctx.user.id })
  const { rdvs } = await agentClient<{ rdvs: RdvspRdv[] }>('/rdvs', {
    query: { id: input.id }
  })

  if (rdvs.length === 0 || !rdvs[0]) {
    throw new Error('Appointment not found')
  }

  const { id, duration_in_min, address, url_for_agents } = rdvs[0]

  return {
    id,
    durationInMin: duration_in_min,
    place: address,
    url: url_for_agents
  }
}
