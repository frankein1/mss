import { Prisma } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

function getFinancialHelpRequestCount(
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  return prismaClient.helpRequest.count({
    where: {
      structureId,
      financialSupport: true,
      ...filters
    }
  })
}

function getInternalFinancialHelpRequestCount(
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  return prismaClient.helpRequest.count({
    where: {
      structureId,
      financialSupport: true,
      externalStructure: false,
      ...filters
    }
  })
}

async function getFinancialHelpRequestTotalAmount(
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  const {
    _sum: { allocatedAmount: financialHelpRequestTotalAmount }
  } = await prismaClient.helpRequest.aggregate({
    where: {
      structureId,
      financialSupport: true,
      status: 'Accepted',
      allocatedAmount: { gt: 0 },
      ...filters
    },
    _sum: {
      allocatedAmount: true
    }
  })

  return financialHelpRequestTotalAmount?.toNumber() || 0
}

async function getFinancialHelpRequestAmountByType(
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  // Prisma does not allow selecting type.id and type.name on a groupBy
  const helpRequestAmountByTypeId = await prismaClient.helpRequest.groupBy({
    by: ['typeId'],
    where: {
      structureId,
      financialSupport: true,
      status: 'Accepted',
      allocatedAmount: { gt: 0 },
      ...filters
    },
    _sum: {
      allocatedAmount: true
    }
  })

  // Raw query to join followup types with allocated amount can not be used due to the conditional filters
  const followupTypes = await prismaClient.followupType.findMany({
    where: {
      id: {
        in: helpRequestAmountByTypeId.map(({ typeId }) => typeId)
      }
    },
    select: { id: true, name: true }
  })

  return helpRequestAmountByTypeId.reduce(
    (helpRequestAmountByType, helpRequestAmount) => {
      const followupType = followupTypes.find(
        ({ id }) => id === helpRequestAmount.typeId
      )
      if (!followupType) {
        // This case should not occur, but it exists for type-safety
        return helpRequestAmountByType
      }
      return [
        ...helpRequestAmountByType,
        {
          type: followupType,
          allocatedAmount:
            helpRequestAmount._sum.allocatedAmount?.toNumber() || 0
        }
      ]
    },
    [] as Array<{ type: { id: string; name: string }; allocatedAmount: number }>
  )
}

export const getFinancialHelpRequestsStats = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const { structureId } = user
  const filters = prepareHelpRequestStatFilters(input)

  const [
    financialHelpRequestCount,
    internalFinancialHelpRequestCount,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  ] = await Promise.all([
    getFinancialHelpRequestCount(structureId, filters),
    getInternalFinancialHelpRequestCount(structureId, filters),
    getFinancialHelpRequestTotalAmount(structureId, filters),
    getFinancialHelpRequestAmountByType(structureId, filters)
  ])

  return {
    financialHelpRequestCount,
    internalFinancialHelpRequestCount,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  }
}
