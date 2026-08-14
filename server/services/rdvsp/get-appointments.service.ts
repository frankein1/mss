import type { ProtectedAppContext } from '~~/server/trpc'
import { getAgentClient } from './helper'

import { BeneficiaryRepo } from '~~/server/database'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'

export default async function getAppointments({
  input,
  ctx
}: {
  input: { familyFileId: string }
  ctx: ProtectedAppContext
}) {
  const agentClient = getAgentClient({ user_id: ctx.user.id })
  const beneficiaries = await BeneficiaryRepo.findMany(ctx.user, {
    where: { familyFileId: input.familyFileId },
    select: { externalRdvspId: true }
  })
  const beneficiaryExternalIds = beneficiaries
    .filter(({ externalRdvspId }) => !!externalRdvspId)
    .map(({ externalRdvspId }) => externalRdvspId!)

  if (beneficiaryExternalIds.length === 0) {
    return []
  }
  const { rdvs } = await agentClient<{ rdvs: RdvspRdv[] }>('/rdvs', {
    query: {
      'user_id[]': beneficiaryExternalIds,
      'include[]': ['motif', 'users', 'agents']
    }
  })

  return rdvs
}
