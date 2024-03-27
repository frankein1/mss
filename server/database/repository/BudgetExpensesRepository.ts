import { Prisma } from '@prisma/client'
import { BudgetExpensesConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findUniqueOrThrow<
  T extends Prisma.BudgetExpensesFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetExpensesFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, BudgetExpensesConstraints.get)
  return prismaClient.budgetExpenses.findUniqueOrThrow(params)
}

function update<T extends Prisma.BudgetExpensesUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetExpensesUpdateArgs>
) {
  appendConstraints(user, params, BudgetExpensesConstraints.get)
  return prismaClient.budgetExpenses.update(params)
}

export const BudgetExpensesRepo = {
  findUniqueOrThrow,
  update
}
