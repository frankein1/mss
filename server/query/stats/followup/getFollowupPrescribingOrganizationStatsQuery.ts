import { Prisma } from '@prisma/client'
import {
  prepareSocialSupportStatFilters,
  preparePrescribingOrganizationStats
} from '../helpers'
import { FollowupRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupPrescribingOrganizationStatsQuery(
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

  const followups = await FollowupRepo.findMany(user, {
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
  return preparePrescribingOrganizationStats(followups)
}
