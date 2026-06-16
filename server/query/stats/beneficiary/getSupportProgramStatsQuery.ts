import { prismaClient } from '~/server/prisma'
import { prepareBeneficiaryStatFilters, prepareDateFilters } from '../helpers'
import { BeneficiaryConstraints } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { StatPeriodFilter } from '~/types/stat'

export async function getSupportProgramStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  // Filters without period: the main count shows all beneficiaries with this support program
  // regardless of the period filter (period only applies to entry/exit counts)
  const baseFilters = prepareBeneficiaryStatFilters({
    ...input,
    period: undefined,
    fromDate: undefined,
    toDate: undefined
  })

  // Group by (supportProgramNameId, beneficiaryId) to get unique (support program, beneficiary) pairs,
  // then count in JS — equivalent to COUNT(DISTINCT beneficiaryId) GROUP BY supportProgramNameId
  const pairs = await prismaClient.supportProgram.groupBy({
    by: ['supportProgramNameId', 'beneficiaryId'],
    where: {
      beneficiary: {
        ...baseFilters,
        ...constraints
      }
    }
  })

  if (pairs.length === 0) {
    return []
  }

  const countBySupportProgramNameId: Record<string, number> = {}
  for (const { supportProgramNameId } of pairs) {
    countBySupportProgramNameId[supportProgramNameId] =
      (countBySupportProgramNameId[supportProgramNameId] ?? 0) + 1
  }

  const hasDateFilter =
    (input.period && input.period !== StatPeriodFilter.Custom) ||
    (input.period === StatPeriodFilter.Custom &&
      (input.fromDate || input.toDate))

  const entryCountBySupportProgramNameId: Record<string, number> = {}
  const exitCountBySupportProgramNameId: Record<string, number> = {}

  if (hasDateFilter) {
    const periodDateFilter = prepareDateFilters(input)!
    const beneficiaryWhere = { ...baseFilters, ...constraints }

    const [entryPairs, exitPairs] = await Promise.all([
      prismaClient.supportProgram.groupBy({
        by: ['supportProgramNameId', 'beneficiaryId'],
        where: { startDate: periodDateFilter, beneficiary: beneficiaryWhere }
      }),
      prismaClient.supportProgram.groupBy({
        by: ['supportProgramNameId', 'beneficiaryId'],
        where: { endDate: periodDateFilter, beneficiary: beneficiaryWhere }
      })
    ])

    for (const { supportProgramNameId } of entryPairs) {
      entryCountBySupportProgramNameId[supportProgramNameId] =
        (entryCountBySupportProgramNameId[supportProgramNameId] ?? 0) + 1
    }
    for (const { supportProgramNameId } of exitPairs) {
      exitCountBySupportProgramNameId[supportProgramNameId] =
        (exitCountBySupportProgramNameId[supportProgramNameId] ?? 0) + 1
    }
  }

  const supportProgramNameIds = Object.keys(countBySupportProgramNameId)
  const supportProgramNames = await prismaClient.supportProgramName.findMany({
    where: { id: { in: supportProgramNameIds } },
    select: { id: true, name: true }
  })

  const nameById = Object.fromEntries(
    supportProgramNames.map(d => [d.id, d.name])
  )

  return Object.entries(countBySupportProgramNameId)
    .map(([supportProgramNameId, count]) => ({
      name: nameById[supportProgramNameId] ?? '',
      count,
      entryCount: entryCountBySupportProgramNameId[supportProgramNameId] ?? 0,
      exitCount: exitCountBySupportProgramNameId[supportProgramNameId] ?? 0
    }))
    .sort((a, b) => b.count - a.count)
}
