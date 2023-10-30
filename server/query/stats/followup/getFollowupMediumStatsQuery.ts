import { FollowupRepo, FollowupConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupMediumStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareFollowupStatFilters(input)
  Object.assign(where, FollowupConstraints.get(user))

  return await FollowupRepo.prisma.groupBy({
    by: ['medium'],
    where,
    _count: true,
    orderBy: { _count: { medium: 'desc' } }
  })
}
