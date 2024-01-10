import { Prisma } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { FollowupRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareSocialSupportStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters
        }
      : {}

  return await FollowupRepo.count(user, {
    where: {
      socialSupport: {
        structureId: user.structureId || '',
        ...preparedFilters,
        beneficiary: beneficiaryFilters
      }
    }
  })
}
