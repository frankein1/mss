import { prepareFollowupStatFilters } from '../helpers'
import { SocialSupportRepo } from '~~/server/database'
import type { StatFilterInput } from '~~/server/schema'
import type { SecurityRuleGrantee } from '~~/server/security/rules/types'

export async function getFollowupCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: { ...prepareFollowupStatFilters(input) } }

  return await SocialSupportRepo.count(user, where)
}
