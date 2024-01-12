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
    formattedFilters.socialSupport = { status: filters.status }
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.followupTypes) {
    const types = {
      some: { id: { in: filters.followupTypes } }
    }
    if (formattedFilters.socialSupport) {
      formattedFilters.socialSupport.types = types
    } else {
      formattedFilters.socialSupport = { types }
    }
  }

  if (filters.referents) {
    const beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
    if (formattedFilters.socialSupport) {
      formattedFilters.socialSupport.beneficiary = beneficiary
    } else {
      formattedFilters.socialSupport = { beneficiary }
    }
  }

  if (filters.ministre) {
    const ministre = { in: filters.ministre }
    if (formattedFilters.socialSupport) {
      formattedFilters.socialSupport.ministre = ministre
    } else {
      formattedFilters.socialSupport = { ministre }
    }
  }

  return formattedFilters
}
