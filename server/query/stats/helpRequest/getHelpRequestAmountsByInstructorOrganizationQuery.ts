import { prepareSocialSupportStatFilters } from '../helpers'
import {
  SocialSupportConstraints,
  HelpRequestRepo,
  PartnerOrganizationRepo
} from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import { prismaDecimalToNumber } from '~/utils/prisma'
import { STATS_NULL_LABEL, STATS_NULL_KEY } from '~/utils/constants/stats'

export async function getHelpRequestAmountsByInstructorOrganizationQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // FIXME Use of prisma.groupBy necessitates manual adding of constraints
  const socialSupport = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, socialSupport, SocialSupportConstraints.get)

  // Cannot retrieve organization name from this query so perform in 2 steps
  // https://github.com/prisma/prisma/issues/16243#issue-1445823500
  const deviceFilter = input.deviceNameIds?.length
    ? { beneficiaryDevice: { deviceNameId: { in: input.deviceNameIds } } }
    : {}

  const [amountsByOrganizationId, orgs] = await Promise.all([
    HelpRequestRepo.prisma.groupBy({
      by: ['prescribingOrganizationId'],
      where: {
        financialSupport: true,
        askedAmount: { gt: 0 },
        ...deviceFilter,
        fileInstruction: {
          externalStructure: true,
          socialSupport: {
            ...socialSupport.where
          }
        }
      },
      _sum: {
        allocatedAmount: true,
        askedAmount: true
      },
      orderBy: { _sum: { allocatedAmount: 'desc' } }
    }),
    PartnerOrganizationRepo.findMany(user, { select: { id: true, name: true } })
  ])

  const organizationNames = orgs.reduce<Record<string, string>>(
    (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
    {}
  )

  return amountsByOrganizationId.map(amount => ({
    key: amount.prescribingOrganizationId || STATS_NULL_KEY,
    label:
      organizationNames[amount.prescribingOrganizationId || ''] ||
      STATS_NULL_LABEL,
    count: prismaDecimalToNumber(amount._sum.allocatedAmount) || 0,
    subCount: prismaDecimalToNumber(amount._sum.askedAmount) || 0
  }))
}
