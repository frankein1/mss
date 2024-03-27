import { Prisma } from '@prisma/client'
import { BudgetConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findUniqueOrThrow<T extends Prisma.BudgetFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, BudgetConstraints.get)
  return prismaClient.budget.findUniqueOrThrow(params)
}

function update<T extends Prisma.BudgetUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetUpdateArgs>
) {
  appendConstraints(user, params, BudgetConstraints.get)
  return prismaClient.budget.update(params)
}

export const BudgetRepo = {
  findUniqueOrThrow,
  update
}
