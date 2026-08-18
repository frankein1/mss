import type { ProtectedAppContext } from '~~/server/trpc'
import {
  castAppointmentDatestringToUTC,
  getAgentClient,
  getParticipationStatus,
  mapRdvspRdvStatusToAppointmentStatus
} from './helper'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import { UserRepo } from '~~/server/database'

export default async function getAppointment({
  input,
  ctx
}: {
  input: { id: number; beneficiaryExternalRdvspId: number }
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

  console.log('rdv[0]', JSON.stringify(rdvs[0], undefined, 2))

  const status = getParticipationStatus(rdvs[0], [
    input.beneficiaryExternalRdvspId
  ])

  console.log('status', status)
  console.log('agents', agents)

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
