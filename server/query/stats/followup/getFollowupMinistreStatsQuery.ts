import { FollowupRepo, FollowupConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareFollowupStatFilters(input)
  FollowupConstraints.append(user, where)

  return await FollowupRepo.groupBy({
    by: ['ministre'],
    where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
