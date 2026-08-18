import {
  FileInstructionType,
  SocialSupportType,
  type Beneficiary,
  type Prisma,
  type SocialSupport,
  type User
} from '@prisma/client'
import { TypeSuivi } from '~~/client/options'
import { SocialSupportRepo } from '~~/server/database'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import { createQuery } from '~~/server/route'
import {
  getSocialSupportsSchema,
  type GetSocialSupportsInput
} from '~~/server/schema/familyFile/getSocialSupports.schema'
import type { SecurityRuleContext } from '~~/server/security'
import { FamilyFileService, RdvspService } from '~~/server/services'
import type { ProtectedAppContext } from '~~/server/trpc'
import {
  castAppointmentDatestringToUTC,
  findBeneficiaryParticipation,
  getParticipationStatus,
  mapRdvspRdvStatusToAppointmentStatus
} from '~~/server/services/rdvsp/helper'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetSocialSupportsInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  return permissions.view.history
}

function prepareSocialSupportFilters(
  filters: GetSocialSupportsInput['filters']
) {
  // followups and instructions
  const formattedFilters: Prisma.SocialSupportWhereInput = {
    socialSupportType: { not: SocialSupportType.Appointment }
  }

  if (filters.beneficiaryId) {
    formattedFilters.beneficiaryId = filters.beneficiaryId
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.socialSupportSubjects?.length) {
    formattedFilters.subjects = {
      some: { id: { in: filters.socialSupportSubjects } }
    }
  }

  if (filters.typeSuivi) {
    switch (filters.typeSuivi) {
      case TypeSuivi.Followup:
        formattedFilters.socialSupportType = 'Followup'
        break
      case TypeSuivi.AllHelpRequest:
        formattedFilters.socialSupportType = {
          in: ['HelpRequest', 'HelpRequestHousing']
        }
        break
      case TypeSuivi.HousingHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequestHousing'
        break
      case TypeSuivi.FinancialHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequest'
        formattedFilters.subtype = FileInstructionType.Financial
        break
      case TypeSuivi.OtherHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequest'
        break
    }
  }

  return formattedFilters
}

type SocialSupportItem = Pick<
  SocialSupport,
  'id' | 'status' | 'date' | 'socialSupportType' | 'subtype'
> & {
  createdBy: Pick<User, 'firstName' | 'lastName'>
  beneficiary: Pick<Beneficiary, 'firstName' | 'usualName'>
  subjects?: { name: string }[]
  beneficiaryExternalRdvspId?: number
}

export function mapRdvspRdvToSocialSupportItem(
  rdv: RdvspRdv,
  beneficiaryExternalRdvspIds: number[]
): SocialSupportItem | null {
  const participation = findBeneficiaryParticipation(
    rdv,
    beneficiaryExternalRdvspIds
  )

  if (rdv.participations?.length > 0 && !participation) {
    return null
  }

  const status = getParticipationStatus(rdv, beneficiaryExternalRdvspIds)

  return {
    id: rdv.id.toString(),
    createdBy: {
      firstName: rdv.agents[0]?.first_name ?? '',
      lastName: rdv.agents[0]?.last_name ?? ''
    },
    beneficiary: {
      firstName:
        participation?.user.first_name ?? rdv.users[0]?.first_name ?? '',
      usualName: participation?.user.last_name ?? rdv.users[0]?.last_name ?? ''
    },
    status: mapRdvspRdvStatusToAppointmentStatus(status),
    date: castAppointmentDatestringToUTC(rdv.starts_at),
    socialSupportType: SocialSupportType.Appointment,
    // Be careful, the frontend checks the presence of the [Collectif] fragment
    // in "subtype" to determine allowed status updates on appointments.
    subtype: `${rdv.motif.collectif ? '[Collectif] ' : ''}${rdv.motif.name}`,
    beneficiaryExternalRdvspId: participation?.user.id
  }
}

const handler = async ({
  input,
  ctx
}: {
  input: GetSocialSupportsInput
  ctx: ProtectedAppContext
}): Promise<SocialSupportItem[]> => {
  const filters = prepareSocialSupportFilters(input.filters)

  const shouldRetrieveAppointments =
    ctx.structure.externalRdvspActive &&
    (!input.filters.typeSuivi || input.filters.typeSuivi === TypeSuivi.Rdv)
  const shouldRetrieveSocialSupports = input.filters.typeSuivi !== TypeSuivi.Rdv
  const [appointments, socialSupports] = await Promise.all([
    shouldRetrieveAppointments
      ? RdvspService.getAppointments({
          input: { familyFileId: input.familyFileId },
          ctx
        })
          .then(({ rdvs, beneficiaryExternalIds }) =>
            rdvs
              .map(rdv =>
                mapRdvspRdvToSocialSupportItem(rdv, beneficiaryExternalIds)
              )
              .filter((item): item is SocialSupportItem => item !== null)
          )
          .catch(error => {
            console.error(error)
            return []
          })
      : [],
    shouldRetrieveSocialSupports
      ? SocialSupportRepo.findMany(ctx.user, {
          select: {
            id: true,
            status: true,
            createdBy: { select: { firstName: true, lastName: true } },
            date: true,
            beneficiary: {
              select: { firstName: true, usualName: true }
            },
            socialSupportType: true,
            subtype: true,
            subjects: { select: { name: true } }
          },
          where: {
            ...filters,
            familyFileId: input.familyFileId
          },
          orderBy: [{ date: 'desc' }, { created: 'desc' }]
        })
      : []
  ])

  return [...socialSupports, ...appointments].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )
}

export const getSocialSupports = createQuery({
  inputValidation: getSocialSupportsSchema,
  securityCheck,
  handler
})
