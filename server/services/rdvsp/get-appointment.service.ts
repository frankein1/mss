import type { ProtectedAppContext } from '~~/server/trpc'
import {
  castAppointmentDatestringToUTC,
  findBeneficiaryParticipation,
  getAgentClient,
  getStatusFromRdv,
  mapRdvspRdvStatusToAppointmentStatus
} from './helper'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import { BeneficiaryRepo, UserRepo } from '~~/server/database'
import { internal } from '~/utils/api/errors'

export default async function getAppointment({
  input,
  ctx
}: {
  input: { id: number; beneficiaryId?: string | null }
  ctx: ProtectedAppContext
}) {
  const agentClient = getAgentClient({ user_id: ctx.user.id })
  const { rdvs } = await agentClient<{ rdvs: RdvspRdv[] }>('/rdvs', {
    query: {
      'id': input.id,
      'include[]': ['motif', 'agents', 'participations']
    }
  })

  if (rdvs.length === 0 || !rdvs[0]) {
    throw new Error('Appointment not found')
  }

  const {
    id,
    created_by_id,
    agents,
    duration_in_min,
    address,
    url_for_agents,
    motif,
    collectif,
    starts_at
  } = rdvs[0]

  // Only collective appointments carry the beneficiary's status on a per-participation
  // basis. Resolve the beneficiary's RDVSP id server-side from the MSS uuid so the raw
  // RDVSP id never comes from the client. Individual rdvs read `rdv.status` directly.
  let participation: ReturnType<typeof findBeneficiaryParticipation>
  if (collectif) {
    if (!input.beneficiaryId) {
      throw internal(
        'A collective rdv should always link a beneficiary id as an input'
      )
    }
    const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      select: { externalRdvspId: true },
      where: { id: input.beneficiaryId }
    })
    if (beneficiary.externalRdvspId) {
      participation = findBeneficiaryParticipation(rdvs[0], [
        Number(beneficiary.externalRdvspId)
      ])
    }
  }
  const status = getStatusFromRdv(rdvs[0], participation)

  const createdBy = { id: created_by_id, firstName: '', lastName: '' }
  if (created_by_id === agents[0]?.id) {
    createdBy.firstName = agents[0].first_name
    createdBy.lastName = agents[0].last_name
  } else {
    const users = await UserRepo.findMany(ctx.user, {
      select: {
        firstName: true,
        lastName: true
      },
      where: {
        externalAccounts: {
          some: { provider: 'rdvsp', providerAccountId: String(created_by_id) }
        }
      }
    })
    if (users[0]) {
      createdBy.firstName = users[0].firstName
      createdBy.lastName = users[0].lastName
    }
  }

  return {
    id,
    durationInMin: duration_in_min,
    place: address,
    url: url_for_agents,
    createdBy,
    type: motif.location_type,
    collectif,
    status: mapRdvspRdvStatusToAppointmentStatus(status),
    date: castAppointmentDatestringToUTC(starts_at)
  }
}
