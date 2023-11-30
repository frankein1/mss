import { Prisma } from '@prisma/client'
import {
  HelpRequestRepo,
  FollowupTypeRepo,
  HelpRequestConstraints
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { prepareHelpRequestStatFilters } from '~/utils/filters'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

function getFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  filters: Prisma.HelpRequestWhereInput
) {
  return HelpRequestRepo.count(user, {
    where: {
      financialSupport: true,
      ...filters
    }
  })
}

function getInternalFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  filters: Prisma.HelpRequestWhereInput
) {
  return HelpRequestRepo.count(user, {
    where: {
      financialSupport: true,
      externalStructure: false,
      ...filters
    }
  })
}

async function getFinancialHelpRequestTotalAmount(
  user: SecurityRuleGrantee,
  filters: Prisma.HelpRequestWhereInput
) {
  const {
    _sum: { allocatedAmount: financialHelpRequestTotalAmount }
  } = await HelpRequestRepo.aggregate(user, {
    where: {
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
  filters: Prisma.HelpRequestWhereInput
) {
  // Prisma does not allow selecting type.id and type.name on a groupBy
  const helpRequestAmountByTypeId = await HelpRequestRepo.prisma.groupBy({
    by: ['typeId'],
    where: {
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
  const filters = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, filters, HelpRequestConstraints.get)

  const [
    financialHelpRequestCount,
    internalFinancialHelpRequestCount,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  ] = await Promise.all([
    getFinancialHelpRequestCount(user, filters.where),
    getInternalFinancialHelpRequestCount(user, filters.where),
    getFinancialHelpRequestTotalAmount(user, filters.where),
    getFinancialHelpRequestAmountByType(user, filters.where)
  ])

  const requestsCounts = {
    total: {
      key: 'total',
      label: "Nombre d'instructions",
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
