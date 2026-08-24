import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import RemoveAccents from 'remove-accents'
import { AgeGroup } from '~~/client/options'
import type { BeneficiaryFilterServerInput } from '~~/server/schema'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
import dayjs from 'dayjs'
import { generatorRegExp } from '~/utils/generateFileNumber'

interface PrepareBeneficiarySearchConditionsOptions {
  isMinistry?: boolean
}

export function prepareBeneficiarySearchConditions(
  query: string,
  options: PrepareBeneficiarySearchConditionsOptions = {}
): {
  AND: Prisma.BeneficiaryWhereInput[]
} {
  const { isMinistry } = options
  const trimmedQuery = query.trim()

  const nameFields = [
    'usualNameNormalized',
    'birthNameNormalized',
    'firstNameNormalized'
  ] as const

  // Normalize for name search
  const normalizedQuery = RemoveAccents.remove(
    trimmedQuery.replace(/%/g, '').toLowerCase()
  )

  if (isMinistry && normalizedQuery.startsWith('a-')) {
    return {
      AND: [{ numeroPegase: { startsWith: normalizedQuery.toUpperCase() } }]
    }
  }
  const tokens = normalizedQuery.split(/\s+/g).filter(Boolean)

  // Name search: each token must match at least one name field
  // (token1 in firstName OR lastName OR birthName) AND (token2 in firstName OR lastName OR birthName)
  const nameTokenConditions = tokens.map(token => ({
    OR: nameFields.map(field => ({
      [field]: { contains: token }
    }))
  }))

  // If query looks like a fileNumber, also allow matching by fileNumber prefix
  const looksLikeFileNumber =
    trimmedQuery.length >= 3 && generatorRegExp.test(trimmedQuery.toUpperCase())

  if (looksLikeFileNumber) {
    // Match by fileNumber OR by name
    return {
      AND: [
        {
          OR: [
            { fileNumber: { startsWith: trimmedQuery.toUpperCase() } },
            { AND: nameTokenConditions }
          ]
        }
      ]
    }
  }

  // Name search only
  return { AND: nameTokenConditions }
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

  if (filters.ageGroup && filters.ageGroup !== AgeGroup.Custom) {
    const dateRange = ageGroupToDateRange(filters.ageGroup)
    formattedFilters.birthDate = {
      gte: dateRange.lower?.toDate(),
      lte: dateRange.upper?.toDate()
    }
  }

  if (filters.fromAge || filters.toAge) {
    const today = dayjs().hour(0).minute(0).second(0).millisecond(0)
    formattedFilters.birthDate = {
      gte: filters.toAge
        ? today
            .subtract(filters.toAge + 1, 'year')
            .add(1, 'day')
            ?.toDate()
        : undefined,
      lte: filters.fromAge
        ? today.subtract(filters.fromAge, 'year').toDate()
        : undefined
    }
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

  if (filters.supportProgramNameIds?.length) {
    formattedFilters.supportPrograms = {
      some: { supportProgramNameId: { in: filters.supportProgramNameIds } }
    }
  }

  if (formattedFilters.AND.length === 0) {
    // There might not be any filters inside the AND clause after all
    delete formattedFilters.AND
  }

  return formattedFilters
}

// Helpers for updating lastActivity
const prismaClient = new PrismaClient()
export const update = async (beneficiaryId: string, lastActivity: Date) => {
  return await prismaClient.beneficiary.update({
    where: { id: beneficiaryId },
    data: {
      lastActivity: lastActivity
    }
  })
}

export const getBeneficiariesWithLimit = async (limit: number) => {
  return await prismaClient.beneficiary.findMany({
    relationLoadStrategy: 'query',
    take: limit,
    where: {
      lastActivity: null
    },
    select: {
      id: true,
      updated: true,
      created: true,
      documents: {
        select: {
          created: true
        }
      },
      socialSupports: {
        select: {
          updated: true
        }
      },
      familyFile: {
        select: {
          budget: {
            select: {
              updated: true,
              expenses: {
                select: {
                  updated: true,
                  loans: {
                    select: {
                      updated: true
                    }
                  },
                  debts: {
                    select: {
                      updated: true
                    }
                  },
                  customs: {
                    select: {
                      updated: true
                    }
                  }
                }
              },
              incomes: {
                select: {
                  updated: true,
                  customs: {
                    select: {
                      updated: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      workshopAttendees: {
        select: {
          updated: true
        }
      }
    }
  })
}
