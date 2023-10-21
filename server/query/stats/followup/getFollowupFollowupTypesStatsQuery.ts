import { FollowupConstraints, FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const followupWhere = prepareFollowupStatFilters(input)
  Object.assign(followupWhere, FollowupConstraints.get(user))

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followups: {
            where: followupWhere
          }
        }
      }
    },
    orderBy: [{ followups: { _count: 'desc' } }]
  })
}
