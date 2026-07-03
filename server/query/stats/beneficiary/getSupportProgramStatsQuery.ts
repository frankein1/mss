import { prepareBeneficiaryStatFilters, prepareDateFilters } from '../helpers'
import { SupportProgramRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

type DateRange = { gte?: Date; lte?: Date }

function isWithinRange(date: Date | null, range: DateRange): boolean {
  // A nullish date is not within range
  if (!date) {
    return false
  }
  if (range.gte && date < range.gte) {
    return false
  }
  if (range.lte && date > range.lte) {
    return false
  }
  return true
}

type ProgramAggregate = {
  name: string
  totalWithoutPeriodFilter: Set<string>
  entry: Set<string>
  exit: Set<string>
}

export async function getSupportProgramStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const baseFilters = prepareBeneficiaryStatFilters({
    ...input,
    period: undefined,
    fromDate: undefined,
    toDate: undefined
  })

  // We deduplicate beneficiaries per program in JS with Sets (Prisma groupBy can't express
  // COUNT(DISTINCT beneficiaryId) GROUP BY supportProgramNameId).
  const programs = await SupportProgramRepo.findMany(user, {
    where: {
      beneficiaryId: { not: null },
      beneficiary: baseFilters
    },
    select: {
      supportProgramNameId: true,
      beneficiaryId: true,
      startDate: true,
      endDate: true,
      supportProgramName: { select: { name: true } }
    }
  })

  // Period filter applies to entry/exit for this card; when no period filter is active they stay 0.
  const dateRange = prepareDateFilters(input)
  const hasPeriodFilter = Boolean(dateRange && (dateRange.gte || dateRange.lte))

  const byProgram = programs.reduce<Map<string, ProgramAggregate>>(
    (acc, cur) => {
      const aggregate = acc.get(cur.supportProgramNameId) ?? {
        name: cur.supportProgramName.name,
        totalWithoutPeriodFilter: new Set<string>(),
        entry: new Set<string>(),
        exit: new Set<string>()
      }

      aggregate.totalWithoutPeriodFilter.add(cur.beneficiaryId!)

      if (hasPeriodFilter && dateRange) {
        if (isWithinRange(cur.startDate, dateRange)) {
          aggregate.entry.add(cur.beneficiaryId!)
        }
        if (isWithinRange(cur.endDate, dateRange)) {
          aggregate.exit.add(cur.beneficiaryId!)
        }
      }

      return acc.set(cur.supportProgramNameId, aggregate)
    },
    new Map()
  )

  return Array.from(byProgram.values())
    .map(({ name, totalWithoutPeriodFilter, entry, exit }) => ({
      name,
      count: totalWithoutPeriodFilter.size,
      entryCount: entry.size,
      exitCount: exit.size
    }))
    .sort((a, b) => b.count - a.count)
}
