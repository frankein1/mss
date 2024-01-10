import { Prisma } from '@prisma/client'
import {
  preparePrescribingOrganizationStats,
  prepareSocialSupportStatFilters
} from '../helpers'
import { HelpRequestRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestPrescribingOrganizationStatsQuery(
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

  const helpRequests = await HelpRequestRepo.findMany(user, {
    where: {
      socialSupport: {
        ...preparedFilters,
        beneficiary: beneficiaryFilters
      }
    },
    select: {
      prescribingOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return preparePrescribingOrganizationStats(helpRequests)
}
