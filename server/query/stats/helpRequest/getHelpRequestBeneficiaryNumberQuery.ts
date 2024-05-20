import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportRepo, SocialSupportConstraints } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestBeneficiaryNumberQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = {
    where: prepareHelpRequestStatFilters(input)
  }
  appendConstraints(user, where, SocialSupportConstraints.get)

  const res = await SocialSupportRepo.prisma.groupBy({
    by: ['beneficiaryId'],
    ...where
  })

  return res.length
}
