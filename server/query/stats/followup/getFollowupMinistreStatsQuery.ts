import { FollowupRepo, appendConstraintOnFollowup } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareFollowupStatFilters(input)
  appendConstraintOnFollowup(user, where)

  return await FollowupRepo.groupBy({
    by: ['ministre'],
    where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
