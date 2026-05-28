import { prismaClient } from '~/server/prisma'
import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryConstraints } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getBeneficiaryDeviceStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  // Group by (deviceNameId, beneficiaryId) to get unique (device, beneficiary) pairs,
  // then count in JS — equivalent to COUNT(DISTINCT beneficiaryId) GROUP BY deviceNameId
  const pairs = await prismaClient.beneficiaryDevice.groupBy({
    by: ['deviceNameId', 'beneficiaryId'],
    where: {
      beneficiary: {
        ...prepareBeneficiaryStatFilters(input),
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

  const deviceNameIds = Object.keys(countByDeviceNameId)
  const deviceNames = await prismaClient.beneficiaryDeviceName.findMany({
    where: { id: { in: deviceNameIds } },
    select: { id: true, name: true }
  })

  const nameById = Object.fromEntries(deviceNames.map(d => [d.id, d.name]))

  return Object.entries(countByDeviceNameId)
    .map(([deviceNameId, count]) => ({
      name: nameById[deviceNameId] ?? '',
      count
    }))
    .sort((a, b) => b.count - a.count)
}
