import { prepareSocialSupportStatFilters } from '../helpers'
import {
  HelpRequestConstraints,
  BeneficiaryHistoryRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, where, HelpRequestConstraints.get)

  return await BeneficiaryHistoryRepo.prisma.groupBy({
    by: ['ministre'],
    ...where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
