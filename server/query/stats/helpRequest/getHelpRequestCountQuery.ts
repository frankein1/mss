import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareHelpRequestStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters
        }
      : {}

  return await HelpRequestRepo.count(user, {
    where: {
      ...preparedFilters,
      beneficiary: beneficiaryFilters
    }
  })
}
