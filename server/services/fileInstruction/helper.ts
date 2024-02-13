import { Prisma } from '@prisma/client'
import {
  FileInstructionFilterInput,
  ExportFileInstructionsInput
} from '~/server/schema'
import { SortOrder } from '~/types/table'

export function prepareFilters(filters: FileInstructionFilterInput) {
  const formattedFilters: Prisma.FileInstructionWhereInput = {}

  const {
    status,
    followupTypes,
    examinationDate,
    handlingDate,
    externalStructure,
    referents,
    ministre
  } = filters

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

  if (status || followupTypes || referents || ministre) {
    formattedFilters.socialSupport = formattedFilters.socialSupport || {}

    if (status) {
      formattedFilters.socialSupport.status = status
    }

    if (followupTypes) {
      formattedFilters.socialSupport.types = {
        some: { id: { in: followupTypes } }
      }
    }

    if (referents) {
      formattedFilters.socialSupport = {
        beneficiary: {
          referents: { some: { id: { in: referents } } }
        }
      }
    }

    if (ministre) {
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
