import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareSocialSupportStatFilters(input)

  return await SocialSupportRepo.count(user, {
    where: {
      ...preparedFilters,
      socialSupportType: SocialSupportType.HelpRequest
    }
  })
}
