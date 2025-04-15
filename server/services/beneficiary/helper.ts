import { Prisma } from '@prisma/client'
import { BeneficiaryFilterServerInput } from '~/server/schema'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'

export function prepareBeneficiarySearchConditions(query: string): {
  AND: Prisma.BeneficiaryWhereInput[]
} {
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
): Prisma.BeneficiaryWhereInput {
  const formattedFilters: Prisma.BeneficiaryWhereInput = {}
  // When several OR combinations are used on different fields,
  // they need to be combined inside an AND clause.
  formattedFilters.AND = []

  if (filters.search) {
    const searchConditions = prepareBeneficiarySearchConditions(filters.search)
    formattedFilters.AND.push(...searchConditions.AND)
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
    if (!formattedFilters.familyFile) {
      formattedFilters.familyFile = {} as Prisma.FamilyFileWhereInput
    }

    formattedFilters.familyFile.referents = {
      some: { id: { in: filters.referents } }
    }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.ageGroup) {
    const ageFilters = filters.ageGroup.reduce<
      {
        birthDate: Prisma.DateTimeNullableFilter
      }[]
    >((acc, ageGroup) => {
      const dateRange = ageGroupToDateRange(ageGroup)
      acc.push({
        birthDate: {
          gte: dateRange.lower?.toDate(),
          lte: dateRange.upper?.toDate()
        }
      })
      return acc
    }, [])
    formattedFilters.AND.push({ OR: ageFilters })
  }

  if (filters.vulnerablePerson !== undefined) {
    formattedFilters.vulnerablePerson = filters.vulnerablePerson
  }

  if (filters.qpv !== undefined) {
    if (filters.qpv) {
      formattedFilters.qpv = true
    } else {
      formattedFilters.AND.push({ OR: [{ qpv: null }, { qpv: false }] })
    }
  }

  if (filters.ministereDepartementServiceAc) {
    formattedFilters.ministereDepartementServiceAc =
      filters.ministereDepartementServiceAc
  }

  if (filters.ministereStructure) {
    formattedFilters.ministereStructure = filters.ministereStructure
  }

  if (filters.notFilled) {
    formattedFilters[filters.notFilled] = null
  }

  if (formattedFilters.AND.length === 0) {
    // There might not be any filters inside the AND clause after all
    delete formattedFilters.AND
  }

  return formattedFilters
}
