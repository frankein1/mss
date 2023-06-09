import { Prisma } from '~/server/prisma/prismaClient'
import { StatFilterInput } from '~/server/schema'

function prepareDateFilters(filters: StatFilterInput) {
  return {
    ...(filters.fromDate && { gte: filters.fromDate }),
    ...(filters.toDate && { lte: filters.toDate })
  }
}

export function prepareBeneficiaryStatFilters(filters: StatFilterInput) {
  const followupsFilters: { [k: string]: {} } = {}
  const helpRequestsFilters: { [k: string]: {} } = {}

  if (filters.fromDate || filters.toDate) {
    followupsFilters.created = helpRequestsFilters.created =
      prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    const typesListFilter = {
      id: { in: filters.followupTypes }
    }
    followupsFilters.types = { some: typesListFilter }
    helpRequestsFilters.type = typesListFilter
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.fromDate || filters.toDate || filters.followupTypes) {
    formattedFilters.OR = [
      { followups: { some: followupsFilters } },
      { helpRequests: { some: helpRequestsFilters } }
    ]
  }

  if (filters.cities) {
    formattedFilters.city = { in: filters.cities }
  }

  if (filters.referent) {
    formattedFilters.referents = { some: { id: { equals: filters.referent } } }
  }

  return formattedFilters
}

export function prepareHelpRequestStatFilters(filters: StatFilterInput) {
  const formattedFilters: Prisma.HelpRequestWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    formattedFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    formattedFilters.type = { id: { in: filters.followupTypes } }
  }

  if (filters.cities) {
    formattedFilters.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    formattedFilters.createdBy = { id: filters.referent }
  }

  return formattedFilters
}

export function prepareFollowupStatFilters(filters: StatFilterInput) {
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    formattedFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.cities) {
    formattedFilters.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    formattedFilters.createdBy = { id: filters.referent }
  }

  return formattedFilters
}
