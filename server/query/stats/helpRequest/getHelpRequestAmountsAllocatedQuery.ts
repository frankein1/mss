import { prepareSocialSupportStatFilters } from '../helpers'
import { HelpRequestRepo, SocialSupportRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prismaDecimalToNumber } from '~/utils/prisma'
import {
  FileInstructionType,
  SocialSupportStatus,
  SocialSupportType
} from '~/prisma/generated/client'

export async function getHelpRequestAmountsAllocatedQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupport = { where: prepareSocialSupportStatFilters(input) }

  const [
    acceptedFinancialRequestCount,
    internalAllocatedAmount,
    totalAcceptedAmount
  ] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...socialSupport.where,
        socialSupportType: SocialSupportType.HelpRequest,
        status: SocialSupportStatus.Accepted,
        fileInstruction: {
          type: FileInstructionType.Financial
        }
      }
    }),
    HelpRequestRepo.aggregate(user, {
      where: {
        financialSupport: true,
        allocatedAmount: { gt: 0 },
        fileInstruction: {
          externalStructure: false,
          socialSupport: {
            status: SocialSupportStatus.Accepted,
            ...socialSupport.where
          }
        }
      },
      _sum: { allocatedAmount: true, askedAmount: true }
    }),
    HelpRequestRepo.aggregate(user, {
      where: {
        financialSupport: true,
        allocatedAmount: { gt: 0 },
        fileInstruction: {
          socialSupport: {
            status: SocialSupportStatus.Accepted,
            ...socialSupport.where
          }
        }
      },
      _sum: { allocatedAmount: true, askedAmount: true }
    })
  ])

  const count = {
    key: 'count',
    label: 'Nombre de demandes d’aides financières acceptées',
    count: acceptedFinancialRequestCount
  }
  const total = {
    key: 'total',
    label: 'Total des aides délivrées',
    count: prismaDecimalToNumber(totalAcceptedAmount._sum.allocatedAmount) || 0,
    subCount: prismaDecimalToNumber(totalAcceptedAmount._sum.askedAmount) || 0
  }
  const internal = {
    key: 'internal',
    label: 'Aides délivrées en interne',
    count:
      prismaDecimalToNumber(internalAllocatedAmount._sum.allocatedAmount) || 0,
    subCount:
      prismaDecimalToNumber(internalAllocatedAmount._sum.askedAmount) || 0
  }
  const external = {
    key: 'external',
    label: 'Aides délivrées en externe',
    count: total.count - internal.count,
    subCount: total.subCount - internal.subCount
  }

  return { count, breakdown: [total, external, internal] }
}
