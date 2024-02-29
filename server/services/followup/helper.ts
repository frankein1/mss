import { SocialSupportSubject, Prisma } from '@prisma/client'
import { FollowupFilterInput, ExportFollowupsInput } from '~/server/schema'
import { SortOrder } from '~/types/table'

export function prepareSocialSupportSubjectsMutations(
  inputSubjects: string[],
  targetSubjects?: SocialSupportSubject[]
) {
  return {
    connect: inputSubjects.map(id => ({ id })),
    disconnect: targetSubjects
      ?.filter(({ id }) => !inputSubjects.includes(id))
      .map(({ id }) => ({ id }))
  }
}

export function prepareFilters(filters: FollowupFilterInput) {
  const { status, medium, socialSupportSubjects, createdById, ministre } =
    filters

  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (medium) {
    formattedFilters.medium = { in: medium }
  }

  if (status || socialSupportSubjects?.length || createdById || ministre) {
    formattedFilters.socialSupport = {}

    if (status) {
      formattedFilters.socialSupport.status = status
    }

    if (socialSupportSubjects?.length) {
      formattedFilters.socialSupport.subjects = {
        some: { id: { in: socialSupportSubjects } }
      }
    }

    if (createdById) {
      formattedFilters.socialSupport.createdById = { in: createdById }
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
