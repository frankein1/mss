import type { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import type {
  FileInstructionFilterInput,
  ExportFileInstructionsInput
} from '~/server/schema'
import { FileInstructionPeriodFilter } from '~/types/fileInstruction'
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
    period,
    fromDate,
    toDate,
    roomCount,
    lowIncomeHousingType,
    ministereDepartementServiceAc,
    ministereStructure,
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
    ministre?.length ||
    period ||
    ministereDepartementServiceAc ||
    ministereStructure
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

    if (
      (period && period !== FileInstructionPeriodFilter.Custom) ||
      (period === FileInstructionPeriodFilter.Custom && (fromDate || toDate))
    ) {
      formattedFilters.socialSupport.date = prepareDateFilters(filters)
    }

    if (ministereStructure) {
      if (formattedFilters.socialSupport.beneficiary) {
        formattedFilters.socialSupport.beneficiary.ministereStructure =
          ministereStructure
      } else {
        formattedFilters.socialSupport.beneficiary = {
          ministereStructure: filters.ministereStructure
        }
      }
    }
    if (ministereDepartementServiceAc) {
      if (formattedFilters.socialSupport.beneficiary) {
        formattedFilters.socialSupport.beneficiary.ministereDepartementServiceAc =
          ministereDepartementServiceAc
      } else {
        formattedFilters.socialSupport.beneficiary = {
          ministereDepartementServiceAc: filters.ministereDepartementServiceAc
        }
      }
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

  switch (notFilled) {
    case FilterFileInstructionNotFilled.PrescribingOrganization:
      formattedFilters.AND = {
        OR: [
          { helpRequest: { prescribingOrganization: null } },
          { housingHelpRequest: { prescribingOrganization: null } }
        ]
      }
      break
    case FilterFileInstructionNotFilled.InstructorOrganization:
      formattedFilters.instructorOrganization = null
      formattedFilters.externalStructure = true
      break
    case FilterFileInstructionNotFilled.HousingIsFirst:
      if (formattedFilters.housingHelpRequest) {
        formattedFilters.housingHelpRequest.isFirst = null
      } else {
        formattedFilters.housingHelpRequest = { isFirst: null }
      }
      break
    case FilterFileInstructionNotFilled.HousingReason:
      if (formattedFilters.housingHelpRequest) {
        formattedFilters.housingHelpRequest.reason = null
      } else {
        formattedFilters.housingHelpRequest = { reason: null }
      }
      break
    default:
      break
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

function prepareDateFilters(filters: FileInstructionFilterInput) {
  switch (filters.period) {
    case FileInstructionPeriodFilter.ThisYear:
      return {
        gte: dayjs().startOf('year').toDate(),
        lte: dayjs().endOf('year').toDate()
      }
    case FileInstructionPeriodFilter.LastYear:
      return {
        gte: dayjs().subtract(1, 'year').startOf('year').toDate(),
        lte: dayjs().subtract(1, 'year').endOf('year').toDate()
      }
    case FileInstructionPeriodFilter.ThisMonth:
      return {
        gte: dayjs().startOf('month').toDate(),
        lte: dayjs().endOf('month').toDate()
      }
    case FileInstructionPeriodFilter.LastMonth:
      return {
        gte: dayjs().subtract(1, 'month').startOf('month').toDate(),
        lte: dayjs().subtract(1, 'month').endOf('month').toDate()
      }
    case FileInstructionPeriodFilter.Custom:
      return {
        ...(filters.fromDate && { gte: filters.fromDate }),
        ...(filters.toDate && { lte: filters.toDate })
      }
    default:
      return undefined
  }
}
