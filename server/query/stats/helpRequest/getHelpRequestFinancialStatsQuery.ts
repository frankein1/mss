import { Prisma } from '@prisma/client'
import { HelpRequestRepo, FollowupTypeRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canOnlyListItsBeneficiaries
} from '~/server/security/rules'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

function getFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  return HelpRequestRepo.count(user, {
    where: {
      structureId,
      financialSupport: true,
      ...filters
    }
  })
}

function getInternalFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  return HelpRequestRepo.count(user, {
    where: {
      structureId,
      financialSupport: true,
      externalStructure: false,
      ...filters
    }
  })
}

async function getFinancialHelpRequestTotalAmount(
  user: SecurityRuleGrantee,
  structureId: string,
  filters: Prisma.HelpRequestWhereInput
) {
  const {
    _sum: { allocatedAmount: financialHelpRequestTotalAmount }
  } = await HelpRequestRepo.aggregate(user, {
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
  user: SecurityRuleGrantee,
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
  const followupTypes = await FollowupTypeRepo.findMany(user, {
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

export async function getHelpRequestFinancialStatsQuery(
  user: SecurityRuleGrantee,
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

  const filters = { ...preparedFilters, beneficiary: beneficiaryFilters }

  const [
    financialHelpRequestCount,
    internalFinancialHelpRequestCount,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  ] = await Promise.all([
    getFinancialHelpRequestCount(user, user.structureId || '', filters),
    getInternalFinancialHelpRequestCount(user, user.structureId || '', filters),
    getFinancialHelpRequestTotalAmount(user, user.structureId || '', filters),
    getFinancialHelpRequestAmountByType(user, user.structureId || '', filters)
  ])

  const requestsCounts = {
    total: {
      key: 'total',
      label: 'Nombre de demandes',
      count: financialHelpRequestCount || 0
    },
    internal: {
      key: 'internal',
      label: 'Instruites en interne',
      count: internalFinancialHelpRequestCount || 0
    },
    external: {
      key: 'external',
      label: 'Instruites en externe',
      count:
        (financialHelpRequestCount || 0) -
        (internalFinancialHelpRequestCount || 0)
    }
  }
  const financialHelpRequestCounts = Object.values(requestsCounts)
  financialHelpRequestCounts.sort((a, b) => b.count - a.count)

  return {
    financialHelpRequestCounts,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  }
}
