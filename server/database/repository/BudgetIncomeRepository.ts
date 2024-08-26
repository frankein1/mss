import { Prisma } from '@prisma/client'
import { BudgetIncomeConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findUniqueOrThrow<T extends Prisma.BudgetIncomeFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetIncomeFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, BudgetIncomeConstraints.get)
  return prismaClient.budgetIncome.findUniqueOrThrow(params)
}

function update<T extends Prisma.BudgetIncomeUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetIncomeUpdateArgs>
) {
  appendConstraints(user, params, BudgetIncomeConstraints.get)
  return prismaClient.budgetIncome.update(params)
}

export const BudgetIncomeRepo = {
  findUniqueOrThrow,
  update,
  prisma: {
    delete: prismaClient.budgetIncome.delete
  }
}
