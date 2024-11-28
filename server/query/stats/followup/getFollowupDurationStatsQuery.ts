import { prepareSocialSupportStatFilters } from '../helpers'
import { FollowupRepo, FollowupConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupDurationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = {
    where: { socialSupport: prepareSocialSupportStatFilters(input) }
  }
  appendConstraints(user, where, FollowupConstraints.get)

  const res = await FollowupRepo.prisma.groupBy({
    by: ['duration'],
    ...where,
    _count: true,
    orderBy: { _count: { medium: 'desc' } }
  })

  return res
}
