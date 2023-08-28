import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { ProtectedAppContextUser } from '~/server/trpc'
import { prepareFollowupStatFilters } from '~/utils/filters'
import { preparePrescribingOrganizationStats } from '~/utils/stats'

export async function getFollowupPrescribingOrganizationStatsQuery(
  user: ProtectedAppContextUser,
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

  const followups = await prismaClient.followup.findMany({
    where: {
      structureId: user.structureId,
      ...preparedFilters,
      beneficiary: beneficiaryFilters
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
