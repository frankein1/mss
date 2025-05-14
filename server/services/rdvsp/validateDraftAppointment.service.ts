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
import type { RdvspRdv } from '~/server/lib/rdvsp-oauth.client'
import { TRPCError } from '@trpc/server'

/** Sync validated appointments from RDVSP and remove draft status
 *
 * WARNING1: the RDVSP API is not adapted to fetch validated rdvsp.rdvs
 * from rdvsp.rdv_plans.
 * As a result only appointments more recent than 2 days before will be synced for the time being
 *
 * WARNING2: Appointment created with a date set more than 2 days in the past
 * will not be synced
 */
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

  const now = dayjs(new Date())
  const twoDaysBeforeNow = now.subtract(2, 'day')

  let rdvsMoreRecentThan2Days: RdvspRdv[] = []

  try {
    const cfg = client.getConfig()
    rdvsMoreRecentThan2Days = await client.getRdvsStartingAfter(
      cfg,
      res.accessToken,
      res.externalStructureId,
      twoDaysBeforeNow.format('YYYY-MM-DD')
    )
  } catch (e: unknown) {
    if (e instanceof TRPCError && e.code === 'UNAUTHORIZED') {
      // Since refresh tokens are not used yet, the synchronization
      // is not done when the user is not authenticated to RDVSP.
      // The validation of draft appointments should fail silently in this case
      console.log(
        'rdvsp: not authenticated in  validateDraftAppointmentsForFamilyFile'
      )
      return
    }
    throw e
  }

  const drafts = await SocialSupportRepo.findMany(ctx.user, {
    where: {
      familyFileId,
      created: { gte: twoDaysBeforeNow.toDate() },
      appointment: { draft: true }
    },
    select: {
      id: true,
      beneficiaryId: true,
      appointment: { select: { id: true, externalDraftId: true } },
      beneficiary: { select: { externalRdvspId: true } }
    }
  })

  const promises = drafts.map(draft =>
    validateDraftAppointment({
      ctx,
      input: {
        socialSupport: draft,
        accessToken: res.accessToken,
        rdvList: rdvsMoreRecentThan2Days
      }
    })
  )

  return await Promise.allSettled(promises)
}

/** Sync validated appointments from RDVSP and remove draft status
 *
 * WARNING1: the RDVSP API is not adapted to fetch validated rdvsp.rdvs
 * from rdvsp.rdv_plans.
 * As a result only appointments more recent than 2 days before will be synced for the time being
 *
 * WARNING2: Appointment created with a date set more than 2 days in the past
 * will not be synced
 */
export async function validateDraftAppointmentsForAgent({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  const res = await prepare({ ctx })
  if (!res) {
    return
  }

  const now = dayjs(new Date())
  const twoDaysBeforeNow = now.subtract(2, 'day')

  let rdvsMoreRecentThan2Days: RdvspRdv[] = []

  try {
    const cfg = client.getConfig()
    rdvsMoreRecentThan2Days = await client.getRdvsStartingAfter(
      cfg,
      res.accessToken,
      res.externalStructureId,
      twoDaysBeforeNow.format('YYYY-MM-DD')
    )
  } catch (e: unknown) {
    if (e instanceof TRPCError && e.code === 'UNAUTHORIZED') {
      // Since refresh tokens are not used yet, the synchronization
      // is not done when the user is not authenticated to RDVSP.
      // The validation of draft appointments should fail silently in this case
      console.log(
        'rdvsp: not authenticated in  validateDraftAppointmentsForAgent'
      )
      return
    }
    throw e
  }

  const drafts = await SocialSupportRepo.findMany(ctx.user, {
    where: {
      created: { gte: twoDaysBeforeNow.toDate() },
      appointment: { draft: true }
    },
    select: {
      id: true,
      beneficiaryId: true,
      appointment: { select: { id: true, externalDraftId: true } },
      beneficiary: { select: { externalRdvspId: true } }
    }
  })

  const promises = drafts.map(draft =>
    validateDraftAppointment({
      ctx,
      input: {
        socialSupport: draft,
        accessToken: res.accessToken,
        rdvList: rdvsMoreRecentThan2Days
      }
    })
  )

  return await Promise.allSettled(promises)
}

interface SocialSupportToValidate {
  id: string
  beneficiaryId: string
  appointment: { id: string; externalDraftId: string | null } | null
  beneficiary: { externalRdvspId: string | null } | null
}

async function validateDraftAppointment({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: {
    socialSupport: SocialSupportToValidate
    accessToken: string
    rdvList: RdvspRdv[]
  }
}) {
  const ss = input.socialSupport

  const externalDraftId = ss.appointment?.externalDraftId
  if (!externalDraftId) {
    throw invalidError('Could not find appointment external draft id')
  }

  // FIXME il faudrait pouvoir récupérer un rdv complet à partir d'un rdv plan: demander à l'équipe de RDVSP
  const rdv = await getRdvspRdvFromList(
    externalDraftId,
    input.accessToken,
    input.rdvList
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
      where: { id: ss.id },
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
    ss.beneficiary &&
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

async function getRdvspRdvFromList(
  externalDraftId: string,
  accessToken: string,
  rdvList: RdvspRdv[]
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

  const filtered = rdvList.filter(
    rdv => rdv.id.toString() === rdvSummary.id.toString()
  )
  const rdv: RdvspRdv | null = filtered.length > 0 ? filtered[0] : null

  if (rdv === null) {
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
 *
 * This function does not take into account all cases but as the time returned by RDVSP
 * is always formatted the same, it should not be a problem.
 *
 * @param {string} dateISO8601 - An ISO8601 date string, usually with a timezone offset.
 */
const getDateWithoutTimezoneInformation = (dateISO8601: string) => {
  let timezone: string | null = null

  if (dateISO8601.slice(-1) === 'Z') {
    // utc YYYY-MM-DDTHH:mm.000Z
    timezone = dateISO8601.slice(-5)
  } else if (dateISO8601.slice(-6).startsWith(' ')) {
    // timezone space YYYY-MM-DD HH:mm +TTTT
    timezone = dateISO8601.slice(-6)
  } else {
    // timezone no space YYYY-MM-DDTHH:mm+TTTT
    timezone = dateISO8601.slice(-5)
  }

  const transformed = dateISO8601.replace(timezone, '')
  return dayjs(`${transformed}+0000`).utc().toDate()
}

export const test = {
  getDateWithoutTimezoneInformation
}
