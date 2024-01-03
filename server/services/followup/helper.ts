import { FollowupType, Prisma } from '@prisma/client'
import { FollowupFilterInput } from '~/server/schema'

export function prepareFollowupTypesMutations(
  inputTypes: string[],
  targetTypes?: FollowupType[]
) {
  return {
    connect: inputTypes.map(id => ({ id })),
    disconnect: targetTypes
      ?.filter(({ id }) => !inputTypes.includes(id))
      .map(({ id }) => ({ id }))
  }
}

export function prepareFollowupFilters(filters: FollowupFilterInput) {
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

  if (filters.referents) {
    formattedFilters.beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
  }

  if (filters.ministre) {
    formattedFilters.ministre = { in: filters.ministre }
  }

  return formattedFilters
}
