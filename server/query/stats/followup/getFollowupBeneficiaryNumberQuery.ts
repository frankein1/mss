import { prepareFollowupStatFilters } from '../helpers'
import { SocialSupportRepo, SocialSupportConstraints } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupBeneficiaryNumberQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: { ...prepareFollowupStatFilters(input) } }

  appendConstraints(user, where, SocialSupportConstraints.get)

  const res = await SocialSupportRepo.prisma.groupBy({
    by: ['beneficiaryId'],
    ...where
  })

  return res.length
}
