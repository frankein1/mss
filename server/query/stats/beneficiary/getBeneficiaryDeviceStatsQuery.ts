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

  const grouped = await prismaClient.beneficiaryDevice.groupBy({
    by: ['deviceNameId'],
    where: {
      beneficiary: {
        ...prepareBeneficiaryStatFilters(input),
        ...constraints
      }
    },
    _count: true,
    orderBy: { _count: { deviceNameId: 'desc' } }
  })

  if (grouped.length === 0) {return []}

  const deviceNameIds = grouped.map(g => g.deviceNameId)
  const deviceNames = await prismaClient.beneficiaryDeviceName.findMany({
    where: { id: { in: deviceNameIds } },
    select: { id: true, name: true }
  })

  const nameById = Object.fromEntries(deviceNames.map(d => [d.id, d.name]))

  return grouped.map(g => ({
    name: nameById[g.deviceNameId] ?? '',
    count: g._count
  }))
}
