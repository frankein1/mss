import type { ProtectedAppContext } from '~~/server/trpc'
import {
  findBeneficiaryParticipation,
  getAgentClient,
  getStatusFromRdv
} from './helper'

import { BeneficiaryRepo } from '~~/server/database'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import type { RdvspStatus } from '~~/types/rdvsp'

// A collective appointment always carries the MSS uuid of the specific participant
// whose status is shown; an individual appointment never does. Modelled as a
// discriminated union so the two can't drift apart.
export type RdvMetadata =
  | { collectif: true; beneficiaryId: string }
  | { collectif: false }
/**
 * Per-rdv intermediate the service hands to the query mapper. The service owns
 * the participation match (which family member is this rdv about) so the mapper
 * can stay a pure rdv -> item shaper. `status` is the RDVSP-native resolved status
 * (the mapper converts it to a SocialSupportStatus); `beneficiary` is the display
 * name of the matched participant (or the first rdv user for individual rdvs).
 */
export type EnrichedAppointment = {
  rdv: RdvspRdv
  status: RdvspStatus
  rdvMetadata: RdvMetadata
  beneficiary: { firstName: string; usualName: string }
}

export default async function getAppointments({
  input,
  ctx
}: {
  input: { familyFileId: string }
  ctx: ProtectedAppContext
}): Promise<EnrichedAppointment[]> {
  const agentClient = getAgentClient({ user_id: ctx.user.id })
  const beneficiaries = await BeneficiaryRepo.findMany(ctx.user, {
    where: { familyFileId: input.familyFileId },
    select: { id: true, externalRdvspId: true }
  })

  // Resolve, server-side, the RDVSP user id <-> MSS beneficiary uuid join so the
  // detail query can be driven by a beneficiaryId and the raw RDVSP id never leaves
  // the server.
  const beneficiaryIdByExternalId = new Map<number, string>()
  for (const { id, externalRdvspId } of beneficiaries) {
    if (externalRdvspId) {
      beneficiaryIdByExternalId.set(Number(externalRdvspId), id)
    }
  }
  const beneficiaryExternalIds = [...beneficiaryIdByExternalId.keys()]

  if (beneficiaryExternalIds.length === 0) {
    return []
  }

  const { rdvs } = await agentClient<{ rdvs: RdvspRdv[] }>('/rdvs', {
    query: {
      'user_id[]': beneficiaryExternalIds,
      'include[]': ['motif', 'users', 'agents', 'participations']
    }
  })

  const res = rdvs.flatMap<EnrichedAppointment>(rdv => {
    const participation = findBeneficiaryParticipation(
      rdv,
      beneficiaryExternalIds
    )

    // Drop rdvs that have participations but none belonging to a family member.
    if (rdv.participations?.length > 0 && !participation) {
      return []
    }

    const status = getStatusFromRdv(rdv, participation)
    const beneficiary = {
      firstName:
        participation?.user.first_name ?? rdv.users[0]?.first_name ?? '',
      usualName: participation?.user.last_name ?? rdv.users[0]?.last_name ?? ''
    }

    if (rdv.collectif) {
      // WARNING: If several family members participate to the same collective rdv,
      // we match the first found(deterministic but arbitrary)
      const beneficiaryId = participation
        ? beneficiaryIdByExternalId.get(participation.user.id)
        : undefined

      // A collective rdv we can't attribute to any family member is dropped
      if (!beneficiaryId) {
        return []
      }

      return [
        {
          rdv,
          status,
          rdvMetadata: { collectif: true, beneficiaryId },
          beneficiary
        }
      ]
    }

    return [{ rdv, status, rdvMetadata: { collectif: false }, beneficiary }]
  })

  return res
}
