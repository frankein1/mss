import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportConstraints, FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const helpRequestWhere = {
    where: {
      ...prepareSocialSupportStatFilters(input),
      socialSupportType: SocialSupportType.HelpRequest
    }
  }
  appendConstraints(user, helpRequestWhere, SocialSupportConstraints.get)

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          socialSupports: helpRequestWhere
        }
      }
    },
    orderBy: [{ socialSupports: { _count: 'desc' } }]
  })
}
