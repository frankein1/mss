import { prepareBeneficiaryStatFilters } from '../helpers'
import {
  BeneficiaryConstraints,
  SupportProgramRepo,
  SupportProgramNameRepo
} from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getSupportProgramStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  // Period is stripped: the count shows all beneficiaries enrolled in each
  // support program regardless of the period filter. This is fragile and
  // deferred for later investigation (see ADR 0003).
  const baseFilters = prepareBeneficiaryStatFilters({
    ...input,
    period: undefined,
    fromDate: undefined,
    toDate: undefined
  })

  // Count distinct beneficiaries per program, not enrollments. Prisma's groupBy
  // doesn't support COUNT(DISTINCT beneficiaryId) GROUP BY supportProgramNameId,
  // so we group by both to deduplicate, then count per program in JS.
  const pairs = await SupportProgramRepo.prisma.groupBy({
    by: ['supportProgramNameId', 'beneficiaryId'],
    where: {
      beneficiaryId: { not: null },
      beneficiary: {
        ...baseFilters,
        ...constraints
      }
    }
  })

  if (pairs.length === 0) {
    return []
  }

  const countBySupportProgramNameId = pairs.reduce<Record<string, number>>(
    (acc, { supportProgramNameId }) => {
      acc[supportProgramNameId] = (acc[supportProgramNameId] ?? 0) + 1
      return acc
    },
    {}
  )

  const supportProgramNameIds = Object.keys(countBySupportProgramNameId)
  const supportProgramNames = await SupportProgramNameRepo.prisma.findMany({
    where: { id: { in: supportProgramNameIds } },
    select: { id: true, name: true }
  })

  const nameById = Object.fromEntries(
    supportProgramNames.map(d => [d.id, d.name])
  )

  return Object.entries(countBySupportProgramNameId)
    .map(([supportProgramNameId, count]) => ({
      name: nameById[supportProgramNameId] ?? '',
      count
    }))
    .sort((a, b) => b.count - a.count)
}
