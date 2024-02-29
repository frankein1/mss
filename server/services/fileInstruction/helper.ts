import { Prisma } from '@prisma/client'
import {
  FileInstructionFilterInput,
  ExportFileInstructionsInput
} from '~/server/schema'
import { SortOrder } from '~/types/table'

export function prepareFilters(filters: FileInstructionFilterInput) {
  const formattedFilters: Prisma.FileInstructionWhereInput = {}

  const {
    fileInstructionType,
    status,
    socialSupportSubjects,
    examinationDate,
    handlingDate,
    externalStructure,
    referents,
    ministre
  } = filters

  if (fileInstructionType) {
    formattedFilters.type = fileInstructionType
  }

  if (handlingDate) {
    formattedFilters.helpRequest = formattedFilters.helpRequest || {}
    formattedFilters.helpRequest.handlingDate =
      handlingDate === 'true' ? { not: null } : null
  }

  if (examinationDate) {
    formattedFilters.examinationDate = examinationDate
  }

  if (externalStructure !== undefined) {
    formattedFilters.externalStructure = externalStructure === 'true'
  }

  if (
    status ||
    socialSupportSubjects?.length ||
    referents?.length ||
    ministre?.length
  ) {
    formattedFilters.socialSupport = formattedFilters.socialSupport || {}

    if (status) {
      formattedFilters.socialSupport.status = status
    }

    if (socialSupportSubjects?.length) {
      formattedFilters.socialSupport.subjects = {
        some: { id: { in: socialSupportSubjects } }
      }
    }

    if (referents?.length) {
      formattedFilters.socialSupport = {
        beneficiary: {
          referents: { some: { id: { in: referents } } }
        }
      }
    }

    if (ministre?.length) {
      formattedFilters.socialSupport = {
        ministre: { in: ministre }
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

  if (sort.instructorOrganization) {
    orderBy.unshift({ externalStructure: SortOrder.Desc })
  }

  return orderBy
}
