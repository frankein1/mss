import { SecurityRuleContext } from '~/server/security'
import {
  AppointmentRepo,
  SocialSupportRepo,
  StructureRepo,
  UserRepo,
  BeneficiaryRepo
} from '~/server/database/repository'
import {
  getAgentAuthInfo,
  APPOINTMENT_STATUS,
  type RdvspStatus,
  checkIntegrationSetupForStructure
} from './helper'
import { invalidError } from '~/server/trpc'
import * as client from '~/server/lib/rdvsp-oauth.client'
import dayjs from 'dayjs'
import { SocialSupportStatus } from '@prisma/client'

export async function validateDraftAppointmentsForFamilyFile({
  ctx,
  input: { familyFileId }
}: {
  ctx: SecurityRuleContext
  input: { familyFileId: string }
}) {
  const res = await prepare({ ctx })
  if (!res) {
    return
  }

  const drafts = await SocialSupportRepo.findMany(ctx.user, {
    where: { familyFileId, appointment: { draft: true } },
    select: { id: true }
  })

  const promises = drafts.map(draft =>
    validateDraftAppointment({
      ctx,
      input: {
        socialSupportId: draft.id,
        accessToken: res.accessToken,
        externalStructureId: res.externalStructureId
      }
    })
  )

  return await Promise.allSettled(promises)
}

export async function validateDraftAppointmentsForAgent({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  const res = await prepare({ ctx })
  if (!res) {
    return
  }

  const drafts = await SocialSupportRepo.findMany(ctx.user, {
    where: { appointment: { draft: true } },
    select: { id: true }
  })

  const promises = drafts.map(draft =>
    validateDraftAppointment({
      ctx,
      input: {
        socialSupportId: draft.id,
        accessToken: res.accessToken,
        externalStructureId: res.externalStructureId
      }
    })
  )

  return await Promise.allSettled(promises)
}

async function validateDraftAppointment({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: {
    socialSupportId: string
    accessToken: string
    externalStructureId: string
  }
}) {
  const ss = await SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.socialSupportId },
    select: {
      beneficiaryId: true,
      appointment: { select: { id: true, externalDraftId: true } },
      beneficiary: { select: { externalRdvspId: true } }
    }
  })

  const externalDraftId = ss.appointment?.externalDraftId
  if (!externalDraftId) {
    throw invalidError('Could not find appointment external draft id')
  }

  // FIXME il faudrait pouvoir récupérer une liste de rdv plan à l'équipe de RDVSP
  const rdv = await getRdvspRdvFromPlan(
    externalDraftId,
    input.externalStructureId,
    input.accessToken
  )

  if (!rdv) {
    return
  }

  console.log('rdvsp: success', rdv)

  const users = await UserRepo.findMany(ctx.user, {
    select: { id: true, externalRdvspId: true },
    where: { externalRdvspId: { not: null } }
  })
  const agent = findAgentFromExternalIds(rdv.externalAgentIds, users)
  if (!agent) {
    throw invalidError('Could not find agent for appointment')
  }

  await Promise.all([
    SocialSupportRepo.update(ctx.user, {
      where: { id: input.socialSupportId },
      data: {
        status:
          APPOINTMENT_STATUS[rdv.status as RdvspStatus] ||
          SocialSupportStatus.RdvUnknown,
        date: rdv.date
      }
    }),
    AppointmentRepo.update(ctx.user, {
      where: { id: ss.appointment?.id || '' },
      data: {
        draft: false,
        externalRdvspId: rdv.id.toString(),
        agentId: agent.id,
        subject: rdv.subject,
        externalSubjectId: rdv.externalSubjectId.toString(),
        // Native postgres times are read in UTC timezone by prisma as '1970-01-01THH:mm:ss.000Z'
        // Since the meeting time as been stored "as is" in the database, it will have to
        // be read by the frontend converted in UTC timezone.
        time: rdv.date,
        place: rdv.place,
        durationInMin: rdv.durationInMin
      }
    })
  ])

  const isNewRdvspUsager =
    rdv.externalUsagerIds[0] &&
    rdv.externalUsagerIds[0].toString() !== ss.beneficiary.externalRdvspId
  if (isNewRdvspUsager) {
    await addUsagerIdToBeneficiary(
      ss.beneficiaryId,
      rdv.externalUsagerIds[0].toString()
    )
  }

  return
}

function findAgentFromExternalIds(
  externalAgentIds: number[],
  agents: { id: string; externalRdvspId: string | null }[]
) {
  return agents.find(a => {
    const index = externalAgentIds.findIndex(
      eid => a.externalRdvspId === eid.toString()
    )
    return index >= 0
  })
}

async function getRdvspRdvFromPlan(
  externalDraftId: string,
  externalStructureId: string,
  accessToken: string
) {
  const cfg = client.getConfig()

  const rdvSummary = await client.getRdvSummaryFromPlan(
    cfg,
    accessToken,
    externalDraftId
  )

  if (!rdvSummary) {
    return null
  }

  if ('error' in rdvSummary) {
    throw invalidError('Could not retrieve summary from plan in rdvsp')
  }

  // FIXME refactor this call to fetch a precise element instead of using the complete list of rdv in organisation
  const rdv = await client.getRdv(
    cfg,
    accessToken,
    rdvSummary.id.toString(),
    externalStructureId
  )

  if (!rdv) {
    throw invalidError('Could not retrieve rdv in rdvsp')
  }

  console.log('rdv.starts_at', rdv.starts_at)
  console.log('date', getDateWithoutTimezoneInformation(rdv.starts_at))
  console.log('now', new Date())
  console.log('tz guess', dayjs.tz.guess())

  return {
    id: rdv.id,
    subject: rdv.motif.name,
    externalSubjectId: rdv.motif.id,
    status: rdv.status,
    place: rdv.address,
    durationInMin: rdv.duration_in_min,
    externalAgentIds: (rdv.agents || []).map(a => a.id),
    // We receive ISO8601 Date strings from RSVP, eg `2024-04-04T12:00:00+02:00`
    // with a timezone offset corresponding to Paris (where the RDVSP servers are located)
    // regardless of the user's timezone. The previous example can be a user from New Caledonia
    // setting a meeting on 2024-04-04 at 12pm local time.
    // Thus, it makes sense to store the "clock on the wall time".
    // Since the meetings are only in-person, the planner will always think of the meeting
    // with the geographical & temporal context of where & when the meeting will take place, not the present one.
    // eg. If the planner set the meeting to `2024-02-04T09:00:00+02:00`, they almost certainly
    // meant 9AM on the April 2nd, no matter if a DST occurs in between, or if the meeting
    // takes place in a different timezone then the one they were in when they set the meeting.
    // Hence why we strip the timezone offset.
    // See https://www.creativedeletion.com/2015/03/19/persisting_future_datetimes.html
    date: getDateWithoutTimezoneInformation(rdv.starts_at),
    externalUsagerIds: (rdv.users || []).map(u => u.id)
  }
}

async function addUsagerIdToBeneficiary(
  beneficiaryId: string,
  externalUsagerId: string
) {
  await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data: { externalRdvspId: externalUsagerId }
  })
}

async function prepare({ ctx }: { ctx: SecurityRuleContext }) {
  if (!ctx.structure.externalRdvspActive) {
    return false
  }

  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.structure.id },
    select: { externalRdvspId: true, externalRdvspActive: true }
  })

  try {
    checkIntegrationSetupForStructure(structure)
  } catch {
    return false
  }

  let accessToken: string
  try {
    const res = await getAgentAuthInfo(ctx.user)
    accessToken = res.accessToken
  } catch {
    return false
  }

  if (!accessToken) {
    return false
  }

  return {
    accessToken,
    externalStructureId: structure.externalRdvspId as string
  }
}

/**
 * This method changes the timezone to UTC while preserving the original time
 * eg. `2024-02-04T12:00:00+12:00` -> `2024-02-04T12:00:00Z`
 * @param {string} dateISO8601 - An ISO8601 date string, usually with a timezone offset.
 */
const getDateWithoutTimezoneInformation = (dateISO8601: string) => {
  return dayjs(dateISO8601).utc(true).toDate()
}

export const test = {
  getDateWithoutTimezoneInformation
}
