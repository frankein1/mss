import { FollowupRepo, FollowupConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareFollowupStatFilters(input) }
  appendConstraints(user, where, FollowupConstraints.get)

  return await FollowupRepo.prisma.groupBy({
    by: ['ministre'],
    ...where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
