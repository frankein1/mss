import type { Prisma } from '@prisma/client'
import type { HelpRequestFilterInput } from '~/server/schema'

/**
 * Prepare filters for help requests from client-side to filters for Prisma query
 * @param filters The inferred type of the filters zod schema for help requests
 * @returns The prisma where input for help requests
 */
export function prepareHelpRequestFilters(
  filters: HelpRequestFilterInput,
  canOnlyListItsBeneficiaries: boolean
) {
  const formattedFilters: Prisma.HelpRequestWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.followupTypes) {
    formattedFilters.type = { id: { in: filters.followupTypes } }
  }

  if (filters.examinationDate) {
    formattedFilters.examinationDate = filters.examinationDate
  }

  if (filters.handlingDate !== undefined) {
    formattedFilters.handlingDate =
      filters.handlingDate === 'true' ? { not: null } : null
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.externalStructure = filters.externalStructure === 'true'
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
