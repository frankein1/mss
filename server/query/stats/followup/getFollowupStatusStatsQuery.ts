import { FollowupRepo, FollowupConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupStatusStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareFollowupStatFilters(input)
  Object.assign(where, FollowupConstraints.get(user))

  return await FollowupRepo.prisma.groupBy({
    by: ['status'],
    where,
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
