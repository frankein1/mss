import { FollowupRepo, appendConstraintOnFollowup } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupStatusStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareFollowupStatFilters(input)
  appendConstraintOnFollowup(user, where)

  return await FollowupRepo.groupBy({
    by: ['status'],
    where,
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
