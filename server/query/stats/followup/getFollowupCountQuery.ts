import { prepareFollowupStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: { ...prepareFollowupStatFilters(input) } }

  return await SocialSupportRepo.count(user, where)
}
