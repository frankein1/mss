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
  formattedFilters.socialSupport = {}
  if (filters.status) {
    formattedFilters.socialSupport.status = filters.status
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.followupTypes) {
    formattedFilters.socialSupport.types = {
      some: { id: { in: filters.followupTypes } }
    }
  }

  if (filters.referents) {
    formattedFilters.socialSupport.beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
  }

  if (filters.ministre) {
    formattedFilters.socialSupport.ministre = { in: filters.ministre }
  }

  return formattedFilters
}
