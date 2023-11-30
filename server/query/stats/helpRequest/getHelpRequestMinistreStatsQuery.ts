import { HelpRequestConstraints, HelpRequestRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, where, HelpRequestConstraints.get)

  return await HelpRequestRepo.prisma.groupBy({
    by: ['ministre'],
    ...where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
