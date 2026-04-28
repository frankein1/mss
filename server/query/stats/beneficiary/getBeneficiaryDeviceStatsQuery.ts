import { prismaClient } from '~/server/prisma'
import { prepareBeneficiaryStatFilters, prepareDateFilters } from '../helpers'
import { BeneficiaryConstraints } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { StatPeriodFilter } from '~/types/stat'

export async function getBeneficiaryDeviceStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  // Filters without period: the main count shows all beneficiaries with this device
  // regardless of the period filter (period only applies to entry/exit counts)
  const baseFilters = prepareBeneficiaryStatFilters({
    ...input,
    period: undefined,
    fromDate: undefined,
    toDate: undefined
  })

  // Group by (deviceNameId, beneficiaryId) to get unique (device, beneficiary) pairs,
  // then count in JS — equivalent to COUNT(DISTINCT beneficiaryId) GROUP BY deviceNameId
  const pairs = await prismaClient.beneficiaryDevice.groupBy({
    by: ['deviceNameId', 'beneficiaryId'],
    where: {
      beneficiary: {
        ...baseFilters,
        ...constraints
      }
    }
  })

  if (pairs.length === 0) {return []}

  const countByDeviceNameId: Record<string, number> = {}
  for (const { deviceNameId } of pairs) {
    countByDeviceNameId[deviceNameId] =
      (countByDeviceNameId[deviceNameId] ?? 0) + 1
  }

  const hasDateFilter =
    (input.period && input.period !== StatPeriodFilter.Custom) ||
    (input.period === StatPeriodFilter.Custom &&
      (input.fromDate || input.toDate))

  const entryCountByDeviceNameId: Record<string, number> = {}
  const exitCountByDeviceNameId: Record<string, number> = {}

  if (hasDateFilter) {
    const periodDateFilter = prepareDateFilters(input)!
    const beneficiaryWhere = { ...baseFilters, ...constraints }

    const [entryPairs, exitPairs] = await Promise.all([
      prismaClient.beneficiaryDevice.groupBy({
        by: ['deviceNameId', 'beneficiaryId'],
        where: { startDate: periodDateFilter, beneficiary: beneficiaryWhere }
      }),
      prismaClient.beneficiaryDevice.groupBy({
        by: ['deviceNameId', 'beneficiaryId'],
        where: { endDate: periodDateFilter, beneficiary: beneficiaryWhere }
      })
    ])

    for (const { deviceNameId } of entryPairs) {
      entryCountByDeviceNameId[deviceNameId] =
        (entryCountByDeviceNameId[deviceNameId] ?? 0) + 1
    }
    for (const { deviceNameId } of exitPairs) {
      exitCountByDeviceNameId[deviceNameId] =
        (exitCountByDeviceNameId[deviceNameId] ?? 0) + 1
    }
  }

  const deviceNameIds = Object.keys(countByDeviceNameId)
  const deviceNames = await prismaClient.beneficiaryDeviceName.findMany({
    where: { id: { in: deviceNameIds } },
    select: { id: true, name: true }
  })

  const nameById = Object.fromEntries(deviceNames.map(d => [d.id, d.name]))

  return Object.entries(countByDeviceNameId)
    .map(([deviceNameId, count]) => ({
      name: nameById[deviceNameId] ?? '',
      count,
      entryCount: entryCountByDeviceNameId[deviceNameId] ?? 0,
      exitCount: exitCountByDeviceNameId[deviceNameId] ?? 0
    }))
    .sort((a, b) => b.count - a.count)
}
