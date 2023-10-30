import dayjs from 'dayjs'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { AgeGroup } from '~/client/options/ageGroup'
import { StatFilterInput } from '~/server/schema'
import { AgeGroupsFilter } from '~/types/stat'
import { dateIsBetween, dateIsSameOrBefore, dateIsSameOrAfter } from '~/utils'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'
import { SecurityRuleGrantee } from '~/server/security'
import { BeneficiaryRepo, BeneficiaryConstraints } from '~/server/database'

enum NullAgeGroup {
  null = STATS_NULL_KEY
}

type AgeGroupOrNull = AgeGroup | NullAgeGroup

export async function getAgeStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  const ageCounts = await BeneficiaryRepo.prisma.groupBy({
    by: ['birthDate'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true,
    orderBy: { _count: { birthDate: 'desc' } }
  })

  const ageGroupsFilters: { [k in AgeGroup]?: AgeGroupsFilter } = {}
  Object.values(AgeGroup).forEach(value => {
    const { lower, upper } = ageGroupToDateRange(value)
    ageGroupsFilters[value] = {
      lower,
      upper
    }
  })
  const ageGroupsCounts: { [k in AgeGroupOrNull]?: number } = {}
  ageCounts.forEach(
    ({ birthDate, _count }: { birthDate: Date | null; _count: number }) => {
      if (birthDate) {
        const convertedBirthDate = dayjs(birthDate)
        ;(
          Object.entries(ageGroupsFilters) as Array<[AgeGroup, AgeGroupsFilter]>
        ).forEach(([key, value]) => {
          if (value.lower && value.upper) {
            if (dateIsBetween(convertedBirthDate, value.lower, value.upper)) {
              ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
            }
          } else if (value.lower) {
            if (dateIsSameOrAfter(convertedBirthDate, value.lower)) {
              ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
            }
          } else if (value.upper) {
            if (dateIsSameOrBefore(convertedBirthDate, value.upper)) {
              ageGroupsCounts[key] = (ageGroupsCounts[key] || 0) + _count
            }
          }
        })
      } else {
        ageGroupsCounts[`${birthDate}`] =
          (ageGroupsCounts[`${birthDate}`] || 0) + _count
      }
    }
  )
  const ageGroupsCountsResults = (
    Object.entries(ageGroupsCounts) as Array<[AgeGroupOrNull, number]>
  ).map(([key, value]) => ({
    ageGroup: key !== STATS_NULL_KEY ? key : null,
    _count: value
  }))
  ageGroupsCountsResults.sort((a, b) => b._count - a._count)

  return ageGroupsCountsResults
}
