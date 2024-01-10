import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import {
  BeneficiaryHistoryConstraints,
  FollowupTypeRepo
} from '~/server/database'
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
      socialSupportType: SocialSupportType.HelpRequestOther
    }
  }
  appendConstraints(user, helpRequestWhere, BeneficiaryHistoryConstraints.get)

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
