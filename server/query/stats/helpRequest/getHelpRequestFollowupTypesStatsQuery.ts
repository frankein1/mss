import { FollowupTypeRepo, HelpRequestConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const helpRequestWhere = prepareHelpRequestStatFilters(input)
  Object.assign(helpRequestWhere, HelpRequestConstraints.get(user))

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: {
            where: helpRequestWhere
          }
        }
      }
    },
    orderBy: [{ helpRequests: { _count: 'desc' } }]
  })
}
