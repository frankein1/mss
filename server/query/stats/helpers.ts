import { FileInstructionType, SocialSupportType, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { STATS_NULL_LABEL, STATS_NULL_KEY } from '~/utils/constants/stats'
import { StatFilterInput } from '~/server/schema'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
import { StatPeriodFilter } from '~/types/stat'

export function preparePrescribingOrganizationStats(
  historyItems: {
    prescribingOrganization: { id: string; name: string } | null
  }[]
) {
  const prescribingOrganizationStats = historyItems.reduce(
    (
      prescribingOrganizations: {
        [k: string]: {
          prescribingOrganizationId: string
          prescribingOrganization: string
          _count: number
        }
      },
      historyItem
    ) => {
      const prescribingOrganizationId =
        historyItem.prescribingOrganization?.id || STATS_NULL_KEY
      if (prescribingOrganizationId in prescribingOrganizations) {
        prescribingOrganizations[prescribingOrganizationId]._count++
      } else {
        prescribingOrganizations[prescribingOrganizationId] = {
          prescribingOrganizationId,
          prescribingOrganization:
            historyItem.prescribingOrganization?.name || STATS_NULL_LABEL,
          _count: 1
        }
      }
      return prescribingOrganizations
    },
    {}
  )
  const prescribingOrganizationStatsValues = Object.values(
    prescribingOrganizationStats
  )
  prescribingOrganizationStatsValues.sort((a, b) => b._count - a._count)
  return prescribingOrganizationStatsValues
}

export function prepareSocialSupportStatFilters(filters: StatFilterInput) {
  const socialSupport: Prisma.SocialSupportWhereInput = {}

  if (filters.ministre) {
    socialSupport.ministre = { in: filters.ministre }
  }

  if (filters.createdById) {
    socialSupport.createdById = { in: filters.createdById }
  }

  if (
    (filters.period && filters.period !== StatPeriodFilter.Custom) ||
    (filters.period === StatPeriodFilter.Custom &&
      (filters.fromDate || filters.toDate))
  ) {
    socialSupport.date = prepareDateFilters(filters)
  }

  if (filters.socialSupportSubjects?.length) {
    socialSupport.subjects = {
      some: { id: { in: filters.socialSupportSubjects } }
    }
  }

  if (filters.cities?.length) {
    socialSupport.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    socialSupport.createdBy = { id: filters.referent }
  }

  if (filters.beneficiaryStatus) {
    if (socialSupport.beneficiary) {
      socialSupport.beneficiary.status = filters.beneficiaryStatus
    } else {
      socialSupport.beneficiary = { status: filters.beneficiaryStatus }
    }
  }

  if (filters.ageGroup) {
    const dateRange = ageGroupToDateRange(filters.ageGroup)
    const gte = dateRange.lower?.toDate()
    const lte = dateRange.upper?.toDate()

    if (socialSupport.beneficiary) {
      socialSupport.beneficiary.birthDate = { gte, lte }
    } else {
      socialSupport.beneficiary = { birthDate: { gte, lte } }
    }
  }

  return socialSupport
}

export function prepareHelpRequestStatFilters(
  filters: StatFilterInput,
  externalStructure?: boolean
) {
  const socialSupport = prepareSocialSupportStatFilters(filters)
  socialSupport.fileInstruction = externalStructure
    ? { externalStructure: true }
    : {}
  socialSupport.fileInstruction.helpRequest = {}

  switch (filters.helpRequestSubject) {
    case FileInstructionType.Housing:
      socialSupport.socialSupportType = 'HelpRequestHousing'
      break
    case FileInstructionType.Financial:
      socialSupport.socialSupportType = 'HelpRequest'
      socialSupport.fileInstruction.helpRequest = { financialSupport: true }
      break
    case FileInstructionType.Other:
      socialSupport.socialSupportType = 'HelpRequest'
      socialSupport.fileInstruction.helpRequest = { financialSupport: false }
      break
    default:
      socialSupport.socialSupportType = {
        in: ['HelpRequest', 'HelpRequestHousing']
      }
      break
  }

  return socialSupport
}

export function prepareFollowupStatFilters(
  filters: StatFilterInput
): Prisma.SocialSupportWhereInput {
  return {
    ...prepareSocialSupportStatFilters(filters),
    socialSupportType: SocialSupportType.Followup
  }
}

/** filterOnBeneficiaryCreated: if true, when filtering on period,
 *  don't filter on socialSupport created during the period
 * but on beneficiaries created during the period */
export function prepareBeneficiaryStatFilters(
  filters: StatFilterInput,
  filterOnBeneficiaryCreated = false
) {
  const socialSupportFilters: Prisma.SocialSupportWhereInput = {}

  const hasDateFilter =
    (filters.period && filters.period !== StatPeriodFilter.Custom) ||
    (filters.period === StatPeriodFilter.Custom &&
      (filters.fromDate || filters.toDate))

  const filterOnSocialSupportCreated =
    hasDateFilter && !filterOnBeneficiaryCreated
  if (filterOnSocialSupportCreated) {
    socialSupportFilters.created = prepareDateFilters(filters)
  }

  if (filters.socialSupportSubjects?.length) {
    const typesListFilter = {
      id: { in: filters.socialSupportSubjects }
    }
    socialSupportFilters.subjects = { some: typesListFilter }
  }

  if (filters.ministre) {
    socialSupportFilters.ministre = { in: filters.ministre }
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (
    filterOnSocialSupportCreated ||
    filters.socialSupportSubjects?.length ||
    filters.ministre
  ) {
    formattedFilters.socialSupports = { some: socialSupportFilters }
  }

  if (filterOnBeneficiaryCreated && hasDateFilter) {
    formattedFilters.created = prepareDateFilters(filters)
  }

  if (filters.cities?.length) {
    formattedFilters.city = { in: filters.cities }
  }

  if (filters.referent) {
    formattedFilters.familyFile = {
      referents: { some: { id: { equals: filters.referent } } }
    }
  }

  if (filters.beneficiaryStatus) {
    formattedFilters.status = filters.beneficiaryStatus
  }

  if (filters.ageGroup) {
    const dateRange = ageGroupToDateRange(filters.ageGroup)
    formattedFilters.birthDate = {
      gte: dateRange.lower?.toDate(),
      lte: dateRange.upper?.toDate()
    }
  }

  return formattedFilters
}

function prepareDateFilters(filters: StatFilterInput) {
  switch (filters.period) {
    case StatPeriodFilter.ThisYear:
      return {
        gte: dayjs().startOf('year').toDate(),
        lte: dayjs().endOf('year').toDate()
      }
    case StatPeriodFilter.LastYear:
      return {
        gte: dayjs().subtract(1, 'year').startOf('year').toDate(),
        lte: dayjs().subtract(1, 'year').endOf('year').toDate()
      }
    case StatPeriodFilter.ThisMonth:
      return {
        gte: dayjs().startOf('month').toDate(),
        lte: dayjs().endOf('month').toDate()
      }
    case StatPeriodFilter.LastMonth:
      return {
        gte: dayjs().subtract(1, 'month').startOf('month').toDate(),
        lte: dayjs().subtract(1, 'month').endOf('month').toDate()
      }
    case StatPeriodFilter.Custom:
      return {
        ...(filters.fromDate && { gte: filters.fromDate }),
        ...(filters.toDate && { lte: filters.toDate })
      }
    default:
      return undefined
  }
}
