import { Prisma } from '@prisma/client'
import { BeneficiaryFilterInput } from '~/server/schema'

export function prepareBeneficiaryFilters(filters: BeneficiaryFilterInput) {
  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.followupTypes) {
    const typesListFilter: Prisma.FollowupTypeWhereInput = {
      id: { in: filters.followupTypes }
    }

    formattedFilters.OR = [
      { followups: { some: { types: { some: typesListFilter } } } },
      { helpRequests: { some: { type: typesListFilter } } }
    ]
  }

  if (filters.cities) {
    formattedFilters.city = { in: filters.cities }
  }

  if (filters.referents) {
    formattedFilters.referents = { some: { id: { in: filters.referents } } }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
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
