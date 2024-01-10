import { Prisma, SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { BeneficiaryHistoryRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestCountQuery(
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

  return await BeneficiaryHistoryRepo.count(user, {
    where: {
      ...preparedFilters,
      socialSupportType: SocialSupportType.HelpRequestOther,
      beneficiary: beneficiaryFilters
    }
  })
}
