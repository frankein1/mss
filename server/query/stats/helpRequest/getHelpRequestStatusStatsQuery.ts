import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { ProtectedAppContextUser } from '~/server/trpc'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestStatusStatsQuery(
  user: ProtectedAppContextUser,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareHelpRequestStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters,
          referents
        }
      : {
          referents
        }

  return await prismaClient.helpRequest.groupBy({
    by: ['status'],
    where: {
      structureId: user.structureId,
      ...preparedFilters,
      beneficiary: beneficiaryFilters
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
