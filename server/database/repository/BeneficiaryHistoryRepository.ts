import { Prisma } from '@prisma/client'
import { BeneficiaryHistoryConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.BeneficiaryHistoryFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryHistoryFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryHistoryConstraints.get)
  return prismaClient.beneficiaryHistory.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.BeneficiaryHistoryCountArgs
) {
  appendConstraints(user, params, BeneficiaryHistoryConstraints.get)
  return prismaClient.beneficiaryHistory.count(params)
}

export const BeneficiaryHistoryRepo = {
  findMany,
  count
}
