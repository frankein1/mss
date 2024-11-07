import { Prisma } from '@prisma/client'
import {
  FileInstructionFilterInput,
  ExportFileInstructionsInput
} from '~/server/schema'
import { SortOrder } from '~/types/table'
import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'

export function prepareFilters(filters: FileInstructionFilterInput) {
  const formattedFilters: Prisma.FileInstructionWhereInput = {}

  const {
    fileInstructionType,
    status,
    socialSupportSubjects,
    examinationDate,
    createdById,
    ministre,
    roomCount,
    lowIncomeHousingType,
    notFilled
  } = filters

  if (fileInstructionType) {
    formattedFilters.type = fileInstructionType
  }

  if (examinationDate) {
    formattedFilters.examinationDate = examinationDate
  }

  if (
    status ||
    socialSupportSubjects?.length ||
    createdById ||
    ministre?.length
  ) {
    formattedFilters.socialSupport = {}

    if (status) {
      formattedFilters.socialSupport.status = status
    }

    if (socialSupportSubjects?.length) {
      formattedFilters.socialSupport.subjects = {
        some: { id: { in: socialSupportSubjects } }
      }
    }

    if (createdById) {
      formattedFilters.socialSupport.createdById = { in: createdById }
    }

    if (ministre?.length) {
      formattedFilters.socialSupport.ministre = { in: ministre }
    }
  }

  if (roomCount || lowIncomeHousingType) {
    formattedFilters.housingHelpRequest = {}

    if (roomCount) {
      formattedFilters.housingHelpRequest.roomCount = { has: roomCount }
    }

    if (lowIncomeHousingType) {
      formattedFilters.housingHelpRequest.lowIncomeHousingType = {
        has: lowIncomeHousingType
      }
    }
  }

  if (notFilled) {
    // PrescribingOrganization
    if (notFilled === FilterFileInstructionNotFilled.PrescribingOrganization) {
      formattedFilters.helpRequest = { prescribingOrganization: null }

      if (formattedFilters.housingHelpRequest) {
        formattedFilters.housingHelpRequest.prescribingOrganization = null
      } else {
        formattedFilters.housingHelpRequest = {
          prescribingOrganization: null
        }
      }
    }
  }

  return formattedFilters
}

export function prepareSort(sort: ExportFileInstructionsInput['orderBy']) {
  const orderBy: Prisma.FileInstructionFindManyArgs['orderBy'] = [sort]

  if (sort.socialSupport?.date) {
    orderBy.push({ socialSupport: { created: SortOrder.Desc } })
  }

  return orderBy
}
