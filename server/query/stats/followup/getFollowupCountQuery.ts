import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareSocialSupportStatFilters(input)

  return await SocialSupportRepo.count(user, {
    where: {
      socialSupportType: 'Followup',
      ...preparedFilters
    }
  })
}
