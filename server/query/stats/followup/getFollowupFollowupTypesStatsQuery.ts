import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupFollowupTypesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareFollowupStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters,
          referents
        }
      : {
          referents
        }

  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followups: {
            where: {
              structureId: user.structureId || '',
              ...preparedFilters,
              beneficiary: beneficiaryFilters
            }
          }
        }
      }
    },
    orderBy: [{ followups: { _count: 'desc' } }]
  })
}
