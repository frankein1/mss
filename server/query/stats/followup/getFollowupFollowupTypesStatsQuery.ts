import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportConstraints, FollowupTypeRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupportWhere = {
    where: {
      ...prepareSocialSupportStatFilters(input),
      socialSupportType: SocialSupportType.Followup
    }
  }
  appendConstraints(user, socialSupportWhere, SocialSupportConstraints.get)

  return await FollowupTypeRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          socialSupports: socialSupportWhere
        }
      }
    },
    orderBy: [{ socialSupports: { _count: 'desc' } }]
  })
}
