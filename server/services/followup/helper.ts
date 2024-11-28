import dayjs from 'dayjs'
import { SocialSupportSubject, Prisma } from '@prisma/client'
import { FollowupFilterInput, ExportFollowupsInput } from '~/server/schema'
import { FollowupPeriodFilter } from '~/types/followup'
import { SortOrder } from '~/types/table'
import { FilterFollowupNotFilled } from '~/utils/constants/filters'

export function prepareSocialSupportSubjectsMutations(
  inputSubjects: string[],
  targetSubjects?: SocialSupportSubject[]
) {
  return {
    connect: inputSubjects.map(id => ({ id })),
    disconnect: targetSubjects
      ?.filter(({ id }) => !inputSubjects.includes(id))
      .map(({ id }) => ({ id }))
  }
}

export function prepareFilters(filters: FollowupFilterInput) {
  const {
    status,
    medium,
    socialSupportSubjects,
    createdById,
    ministre,
    period,
    fromDate,
    toDate,
    notFilled
  } = filters

  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (medium) {
    formattedFilters.medium = { in: medium }
  }

  if (
    status ||
    socialSupportSubjects?.length ||
    createdById ||
    ministre ||
    period
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

    if (ministre) {
      formattedFilters.socialSupport.ministre = { in: ministre }
    }

    if (
      (period && period !== FollowupPeriodFilter.Custom) ||
      (period === FollowupPeriodFilter.Custom && (fromDate || toDate))
    ) {
      formattedFilters.socialSupport.date = prepareDateFilters(filters)
    }
  }

  switch (notFilled) {
    case FilterFollowupNotFilled.PrescribingOrganization:
      formattedFilters.prescribingOrganization = null
      break
    case FilterFollowupNotFilled.Duration:
      formattedFilters.duration = null
      break
    default:
      break
  }

  return formattedFilters
}

export function prepareSort(sort: ExportFollowupsInput['orderBy']) {
  const orderBy: Prisma.FollowupFindManyArgs['orderBy'] = [sort]

  if (sort.socialSupport?.date) {
    orderBy.push({ socialSupport: { created: SortOrder.Desc } })
  }

  return orderBy
}

function prepareDateFilters(filters: FollowupFilterInput) {
  switch (filters.period) {
    case FollowupPeriodFilter.ThisYear:
      return {
        gte: dayjs().startOf('year').toDate(),
        lte: dayjs().endOf('year').toDate()
      }
    case FollowupPeriodFilter.LastYear:
      return {
        gte: dayjs().subtract(1, 'year').startOf('year').toDate(),
        lte: dayjs().subtract(1, 'year').endOf('year').toDate()
      }
    case FollowupPeriodFilter.ThisMonth:
      return {
        gte: dayjs().startOf('month').toDate(),
        lte: dayjs().endOf('month').toDate()
      }
    case FollowupPeriodFilter.LastMonth:
      return {
        gte: dayjs().subtract(1, 'month').startOf('month').toDate(),
        lte: dayjs().subtract(1, 'month').endOf('month').toDate()
      }
    case FollowupPeriodFilter.Custom:
      return {
        ...(filters.fromDate && { gte: filters.fromDate }),
        ...(filters.toDate && { lte: filters.toDate })
      }
    default:
      return undefined
  }
}
