import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportConstraints, FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const helpRequestWhere = {
    where: prepareHelpRequestStatFilters(input)
  }
  appendConstraints(user, helpRequestWhere, SocialSupportConstraints.get)

  const res = await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          socialSupports: helpRequestWhere
        }
      }
    }
  })
  return res.sort((a, b) => b._count.socialSupports - a._count.socialSupports)
}
