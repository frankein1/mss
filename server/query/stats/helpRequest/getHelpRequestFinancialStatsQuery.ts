import { Prisma } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import {
  HelpRequestRepo,
  SocialSupportSubjectRepo,
  SocialSupportConstraints,
  SocialSupportRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

function getFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  { where: socialSupportFilters }: { where: Prisma.SocialSupportWhereInput },
  helpRequestFilters: Prisma.HelpRequestWhereInput
) {
  return SocialSupportRepo.count(user, {
    where: {
      ...socialSupportFilters,
      fileInstruction: { helpRequest: helpRequestFilters }
    }
  })
}

function getInternalFinancialHelpRequestCount(
  user: SecurityRuleGrantee,
  { where: socialSupportFilters }: { where: Prisma.SocialSupportWhereInput },
  helpRequestFilters: Prisma.HelpRequestWhereInput
) {
  return SocialSupportRepo.count(user, {
    where: {
      ...socialSupportFilters,
      fileInstruction: {
        externalStructure: false,
        helpRequest: {
          ...helpRequestFilters
        }
      }
    }
  })
}

async function getFinancialHelpRequestTotalAmount(
  user: SecurityRuleGrantee,
  { where: socialSupportFilters }: { where: Prisma.SocialSupportWhereInput },
  helpRequestFilters: Prisma.HelpRequestWhereInput
) {
  const {
    _sum: { allocatedAmount: financialHelpRequestTotalAmount }
  } = await HelpRequestRepo.aggregate(user, {
    where: {
      ...helpRequestFilters,
      fileInstruction: {
        externalStructure: false,
        socialSupport: {
          status: 'Accepted',
          ...socialSupportFilters
        }
      },
      allocatedAmount: { gt: 0 }
    },
    _sum: {
      allocatedAmount: true
    }
  })

  return financialHelpRequestTotalAmount?.toNumber() || 0
}

async function getFinancialHelpRequestAmountBySubject(
  user: SecurityRuleGrantee,
  { where: socialSupportFilters }: { where: Prisma.SocialSupportWhereInput },
  helpRequestFilters: Prisma.HelpRequestWhereInput
) {
  // Prisma does not allow selecting subject.id and subject.name on a groupBy
  const helpRequestAmountBySubjectId = await HelpRequestRepo.prisma.groupBy({
    by: ['subjectId'],
    where: {
      ...helpRequestFilters,
      fileInstruction: {
        socialSupport: {
          status: 'Accepted',
          ...socialSupportFilters
        }
      },
      allocatedAmount: { gt: 0 }
    },
    _sum: {
      allocatedAmount: true
    }
  })

  // Raw query to join social support subjects with allocated amount can not be used due to the conditional filters
  const socialSupportSubjects = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      id: {
        in: helpRequestAmountBySubjectId.map(({ subjectId }) => subjectId)
      }
    },
    select: { id: true, name: true }
  })

  return helpRequestAmountBySubjectId.reduce(
    (helpRequestAmountBySubject, helpRequestAmount) => {
      const socialSupportSubject = socialSupportSubjects.find(
        ({ id }) => id === helpRequestAmount.subjectId
      )
      if (!socialSupportSubject) {
        // This case should not occur, but it exists for type-safety
        return helpRequestAmountBySubject
      }
      return [
        ...helpRequestAmountBySubject,
        {
          type: socialSupportSubject,
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
  const socialSupportWhere = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, socialSupportWhere, SocialSupportConstraints.get)
  const helpRequestFilters: Prisma.HelpRequestWhereInput = {
    financialSupport: true
  }

  const [
    financialHelpRequestCount,
    internalFinancialHelpRequestCount,
    financialHelpRequestTotalAmount,
    financialHelpRequestAmountByType
  ] = await Promise.all([
    getFinancialHelpRequestCount(user, socialSupportWhere, helpRequestFilters),
    getInternalFinancialHelpRequestCount(
      user,
      socialSupportWhere,
      helpRequestFilters
    ),
    getFinancialHelpRequestTotalAmount(
      user,
      socialSupportWhere,
      helpRequestFilters
    ),
    getFinancialHelpRequestAmountBySubject(
      user,
      socialSupportWhere,
      helpRequestFilters
    )
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
