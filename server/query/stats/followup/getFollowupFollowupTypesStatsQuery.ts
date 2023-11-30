import { FollowupConstraints, FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const followupWhere = { where: prepareFollowupStatFilters(input) }
  appendConstraints(user, followupWhere, FollowupConstraints.get)

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followups: followupWhere
        }
      }
    },
    orderBy: [{ followups: { _count: 'desc' } }]
  })
}
