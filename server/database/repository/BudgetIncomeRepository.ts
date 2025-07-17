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
  appendConstraints(user, params, BudgetIncomeConstraints.update)
  return prismaClient.budgetIncome.update(params)
}

function deleteIncome<T extends Prisma.BudgetIncomeDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BudgetIncomeDeleteArgs>
) {
  appendConstraints(user, params, BudgetIncomeConstraints.delete)
  return prismaClient.budgetIncome.delete(params)
}

export const BudgetIncomeRepo = {
  findUniqueOrThrow,
  update,
  delete: deleteIncome,
  prisma: {
    create: prismaClient.budgetIncome.create
  }
}
