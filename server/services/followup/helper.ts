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
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.status) {
    formattedFilters.socialSupport = { status: filters.status }
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.socialSupportSubjects?.length) {
    const subjects = {
      some: { id: { in: filters.socialSupportSubjects } }
    }
    if (formattedFilters.socialSupport) {
      formattedFilters.socialSupport.subjects = subjects
    } else {
      formattedFilters.socialSupport = { subjects }
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
