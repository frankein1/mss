import { Prisma } from '@prisma/client'
import { STATS_NULL_LABEL } from '~/client/options'
import { StatFilterInput } from '~/server/schema'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

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

  if (filters.fromDate || filters.toDate) {
    socialSupport.date = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    socialSupport.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.cities) {
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

  return socialSupport
}

export function prepareBeneficiaryStatFilters(filters: StatFilterInput) {
  const socialSupportFilters: { [k: string]: {} } = {}

  if (filters.fromDate || filters.toDate) {
    socialSupportFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    const typesListFilter = {
      id: { in: filters.followupTypes }
    }
    socialSupportFilters.types = { some: typesListFilter }
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.fromDate || filters.toDate || filters.followupTypes) {
    formattedFilters.socialSupports = socialSupportFilters
  }

  if (filters.cities) {
    formattedFilters.city = { in: filters.cities }
  }

  if (filters.referent) {
    formattedFilters.referents = { some: { id: { equals: filters.referent } } }
  }

  if (filters.beneficiaryStatus) {
    formattedFilters.status = filters.beneficiaryStatus
  }

  return formattedFilters
}

function prepareDateFilters(filters: StatFilterInput) {
  return {
    ...(filters.fromDate && { gte: filters.fromDate }),
    ...(filters.toDate && { lte: filters.toDate })
  }
}
