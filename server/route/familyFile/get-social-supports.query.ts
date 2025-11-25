import {
  FileInstructionType,
  SocialSupportStatus,
  type Prisma
} from '@prisma/client'
import { TypeSuivi } from '~/client/options'
import { SocialSupportRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import {
  getSocialSupportsSchema,
  type GetSocialSupportsInput
} from '~/server/schema/familyFile/getSocialSupports.schema'
import type { SecurityRuleContext } from '~/server/security'
import { FamilyFileService, RdvspService } from '~/server/services'
import type { ProtectedAppContext } from '~/server/trpc'

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
  // validated appointments, followups and instructions
  const formattedFilters: Prisma.SocialSupportWhereInput = {
    status: { not: SocialSupportStatus.RdvDraft }
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

const handler = async ({
  input,
  ctx
}: {
  input: GetSocialSupportsInput
  ctx: ProtectedAppContext
}) => {
  const filters = prepareSocialSupportFilters(input.filters)

  try {
    await RdvspService.validateDraftAppointmentsForFamilyFile({
      ctx,
      input: { familyFileId: input.familyFileId }
    })
  } catch (e: unknown) {
    console.log(
      'rdvsp: synchronization failed in get social supports, should fail silently',
      e
    )
  }
  const socialSupports = await SocialSupportRepo.findMany(ctx.user, {
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

  return socialSupports
}

export const getSocialSupports = createQuery({
  inputValidation: getSocialSupportsSchema,
  securityCheck,
  handler
})
