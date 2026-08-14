import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo, BeneficiaryConstraints } from '~~/server/database'
import type { StatFilterInput } from '~~/server/schema'
import type { SecurityRuleGrantee } from '~~/server/security/rules/types'

export async function getFamilyFileCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  const files = await BeneficiaryRepo.prisma.groupBy({
    by: ['familyFileId'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true
  })

  let family = 0
  let beneficiary = 0
  files.forEach(file => {
    if (file._count > 1) {
      family++
    } else {
      beneficiary++
    }
  })

  return { family, beneficiary }
}
