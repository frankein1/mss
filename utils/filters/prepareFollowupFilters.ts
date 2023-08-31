import type { Prisma } from '@prisma/client'
import type { FollowupFilterInput } from '~/server/schema'

/**
 * Prepare filters for followups from client-side to filters for Prisma query
 * @param filters The inferred type of the filters zod schema for followups
 * @returns The prisma where input for followups
 */
export function prepareFollowupFilters(
  filters: FollowupFilterInput,
  canOnlyListItsBeneficiaries: boolean
) {
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.referents && !canOnlyListItsBeneficiaries) {
    formattedFilters.beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
  }

  if (filters.ministre) {
    formattedFilters.ministre = { in: filters.ministre }
  }

  return formattedFilters
}
