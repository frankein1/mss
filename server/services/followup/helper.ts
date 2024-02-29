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
  const { status, medium, followupTypes, createdById, ministre } = filters

  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (medium) {
    formattedFilters.medium = { in: medium }
  }

  if (status || followupTypes?.length || createdById || ministre) {
    formattedFilters.socialSupport = {}

    if (status) {
      formattedFilters.socialSupport.status = status
    }

    if (followupTypes?.length) {
      formattedFilters.socialSupport.types = {
        some: { id: { in: followupTypes } }
      }
    }

    if (createdById) {
      formattedFilters.socialSupport.createdById = createdById
    }

    if (ministre) {
      formattedFilters.socialSupport.ministre = { in: ministre }
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
