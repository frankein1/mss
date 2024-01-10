import { Prisma } from '@prisma/client'
import { BeneficiaryHistoryConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.SocialSupportFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryHistoryConstraints.get)
  return prismaClient.socialSupport.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SocialSupportCountArgs
) {
  appendConstraints(user, params, BeneficiaryHistoryConstraints.get)
  return prismaClient.socialSupport.count(params)
}

export const BeneficiaryHistoryRepo = {
  findMany,
  count,
  prisma: {
    groupBy: prismaClient.socialSupport.groupBy,
    findMany: prismaClient.socialSupport.findMany
  }
}
