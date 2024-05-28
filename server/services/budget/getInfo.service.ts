import { BudgetIncome } from '@prisma/client'
import { getExpenses } from './getExpenses.service'
import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import { budgetIncomeKeys, budgetExpensesKeys } from '~/client/options'
import { IncomeKey, ExpensesKey } from '~/types/budget'
import { incrementBudgetTotal } from '~/utils/budget'

type BudgetExpenses = Awaited<ReturnType<typeof getExpenses>>

async function getBudgetNestedElements(
  ctx: SecurityRuleContext,
  beneficiaryId: string
) {
  const infos = await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { beneficiaryId },
    include: {
      incomes: true,
      expenses: { select: { id: true } }
    }
  })

  const expenses = infos.expenses?.id
    ? await getExpenses({ ctx, id: infos.expenses.id })
    : null

  return {
    ...infos,
    expenses
  }
}

function getTotalIncome(incomes: BudgetIncome[]) {
  return incomes.reduce<number | null>((acc, income) => {
    const total = budgetIncomeKeys.keys.reduce<number | null>(
      (iacc, key) => incrementBudgetTotal(iacc, income[key as IncomeKey]),
      null
    )
    return incrementBudgetTotal(acc, total)
  }, null)
}

function getTotalExpenses(expenses: BudgetExpenses) {
  const main = budgetExpensesKeys.keys.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, expenses[cur as ExpensesKey]),
    null
  )

  const loans = expenses.loans.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
    null
  )

  const debts = expenses.debts.reduce<number | null>(
    (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
    null
  )

  return main === null && loans === null && debts === null
    ? null
    : (main || 0) + (loans || 0) + (debts || 0)
}

export async function getInfo({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) {
  const infos = await getBudgetNestedElements(ctx, beneficiaryId)
  const { incomes, expenses, ...data } = infos

  const totalIncome = getTotalIncome(incomes)
  const totalExpenses = expenses ? getTotalExpenses(expenses) : null

  const deltaIncomeExpenses =
    totalIncome === null || totalExpenses === null
      ? null
      : totalIncome - totalExpenses

  return {
    ...data,
    deltaIncomeExpenses
  }
}
