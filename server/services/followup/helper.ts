import { FollowupType, Prisma } from '@prisma/client'
import { FollowupFilterInput, ExportFollowupsInput } from '~/server/schema'
import { SortOrder } from '~/types/table'

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

export function prepareFilters(filters: FollowupFilterInput) {
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.status) {
    formattedFilters.socialSupport = { status: filters.status }
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.followupTypes?.length) {
    const types = {
      some: { id: { in: filters.followupTypes } }
    }
    if (formattedFilters.socialSupport) {
      formattedFilters.socialSupport.types = types
    } else {
      formattedFilters.socialSupport = { types }
    }
  }

  if (filters.referents?.length) {
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

export function prepareSort(sort: ExportFollowupsInput['orderBy']) {
  const orderBy: Prisma.FollowupFindManyArgs['orderBy'] = [sort]

  if (sort.socialSupport?.date) {
    orderBy.push({ socialSupport: { created: SortOrder.Desc } })
  }

  return orderBy
}
