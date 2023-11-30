import { FollowupTypeRepo, HelpRequestConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const helpRequestWhere = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, helpRequestWhere, HelpRequestConstraints.get)

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: helpRequestWhere
        }
      }
    },
    orderBy: [{ helpRequests: { _count: 'desc' } }]
  })
}
