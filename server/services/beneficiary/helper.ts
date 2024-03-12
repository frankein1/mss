import { Prisma } from '@prisma/client'
import { BeneficiaryFilterServerInput } from '~/server/schema'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'

export function prepareBeneficiarySearchConditions(query: string) {
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['usualName', 'birthName', 'firstName'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: {
        contains: token,
        mode: 'insensitive'
      }
    }))
  }))

  return { AND: searchConditions }
}

export function prepareBeneficiaryFilters(
  filters: BeneficiaryFilterServerInput
) {
  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.search) {
    const searchConditions = prepareBeneficiarySearchConditions(filters.search)
    formattedFilters.AND = searchConditions.AND
  }

  if (filters.socialSupportSubjects?.length) {
    const subjectsListFilter: Prisma.SocialSupportSubjectWhereInput = {
      id: { in: filters.socialSupportSubjects }
    }

    formattedFilters.socialSupports = {
      some: { subjects: { some: subjectsListFilter } }
    }
  }

  if (filters.referents?.length) {
    formattedFilters.referents = { some: { id: { in: filters.referents } } }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.ageGroup) {
    const dateRange = ageGroupToDateRange(filters.ageGroup)
    formattedFilters.birthDate = {
      gte: dateRange.lower?.toDate(),
      lte: dateRange.upper?.toDate()
    }
  }

  if (filters.vulnerablePerson !== undefined) {
    formattedFilters.vulnerablePerson = filters.vulnerablePerson
  }

  return formattedFilters
}
