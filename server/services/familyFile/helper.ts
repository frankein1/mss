import { GetHistoryInput } from '~/server/schema'
import { Prisma } from '@prisma/client'
import { TypeSuivi } from '~/client/options'

type HistoryFilters = GetHistoryInput['filters']

export function prepareSocialSupportFilters(
  filters: HistoryFilters,
  familyFileId: string
) {
  const formattedFilters: Prisma.SocialSupportWhereInput = {}

  if (filters.referents?.length) {
    formattedFilters.familyFile = {
      id: familyFileId,
      referents: {
        some: { id: { in: filters.referents } }
      }
    }
  } else {
    formattedFilters.familyFile = { id: familyFileId }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.medium) {
    formattedFilters.followup = { medium: { in: filters.medium } }
  }

  if (filters.examinationDate) {
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.examinationDate = filters.examinationDate
  }

  if (filters.externalStructure !== undefined) {
    const isExternalStructure = filters.externalStructure === 'true'
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.externalStructure = isExternalStructure
  }

  if (filters.handlingDate !== undefined) {
    const handlingDate = filters.handlingDate === 'true' ? { not: null } : null
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.helpRequest =
      formattedFilters.fileInstruction.helpRequest || {}
    formattedFilters.fileInstruction.helpRequest.handlingDate = handlingDate
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
      case TypeSuivi.OtherHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequest'
        formattedFilters.fileInstruction =
          formattedFilters.fileInstruction || {}
        formattedFilters.fileInstruction.helpRequest =
          formattedFilters.fileInstruction.helpRequest || {}
        formattedFilters.fileInstruction.helpRequest = {
          financialSupport: filters.typeSuivi === TypeSuivi.FinancialHelpRequest
        }
    }
  }

  if (filters.beneficiaryId) {
    formattedFilters.beneficiary = { id: filters.beneficiaryId }
  }

  return formattedFilters
}
