import type { ProtectedAppContext } from '~~/server/trpc'
import { getAgentClient } from './helper'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import type { RdvspStatus } from '~~/types/rdvsp'

export default async function updateAppointmentStatus({
  input: { id, status },
  ctx
}: {
  input: { id: number; status: RdvspStatus }
  ctx: ProtectedAppContext
}) {
  const agentClient = getAgentClient({ user_id: ctx.user.id })
  const data = await agentClient<Pick<RdvspRdv, 'status'>>(
    `/rdvs/${id}/update_status`,
    { body: { status }, method: 'PATCH' }
  )

  return data
}
