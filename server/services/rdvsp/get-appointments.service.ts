import type { ProtectedAppContext } from '~/server/trpc'
import { getAgentAuthInfo, getAgentClient } from './helper'

import { BeneficiaryRepo } from '~/server/database'
import type { RdvspRdv } from '~/server/lib/rdvsp-oauth.client'
import { prismaClient } from '~/server/prisma'

export default async function getAppointments({
  input,
  ctx
}: {
  input: { familyFileId?: string; userId?: string; starts_after?: Date }
  ctx: ProtectedAppContext
}) {
  const agentInfo = await getAgentAuthInfo(ctx.user.id)
  const agentClient = getAgentClient({ user_id: ctx.user.id })
  const query: Record<string, any> = {}
  if (input.familyFileId) {
    const beneficiaries = await BeneficiaryRepo.findMany(ctx.user, {
      where: { familyFileId: input.familyFileId },
      select: { externalRdvspId: true }
    })
    const beneficiaryExternalIds = beneficiaries
      .filter(({ externalRdvspId }) => !!externalRdvspId)
      .map(({ externalRdvspId }) => externalRdvspId!)

    if (beneficiaryExternalIds.length !== 0) {
      query['user_id[]'] = beneficiaryExternalIds
    }
  }
  if (input.userId) {
    //query['agent_id'] = agentInfo.providerAccountId
  }

  if (input.starts_after) {
    query['starts_after'] = input.starts_after.toISOString()
  }

  if (Object.keys(query).length === 0) {
    return []
  }

  query['include[]'] = ['motif', 'users', 'agents']

  const { rdvs } = await agentClient<{ rdvs: RdvspRdv[] }>('/rdvs', {
    query
  })

  return rdvs
}
