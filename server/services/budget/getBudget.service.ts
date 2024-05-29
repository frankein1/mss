import { getDeltaIncomeExpenses } from './helpers'
import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import { prismaDecimalToNumber } from '~/utils/prisma'

export async function getBudget({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) {
  const budget = await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { beneficiaryId },
    include: {
      expenses: {
        include: {
          loans: true,
          debts: true
        }
      },
      incomes: {
        include: {
          householdMember: true
        }
      }
    }
  })

  const nMembers = prismaDecimalToNumber(budget.numberHouseholdMembers)
  const deltaIncomeExpenses = getDeltaIncomeExpenses(
    budget.incomes,
    budget.expenses
  )
  const remainingAfterExpenses =
    nMembers === undefined || deltaIncomeExpenses === null
      ? null
      : deltaIncomeExpenses / nMembers

  budget.incomes.sort((a, b) => {
    let res = 0
    if (a.type === 'Beneficiary') {
      res = -1
    } else if (b.type === 'Beneficiary') {
      res = 1
    } else if (a.householdMember?.relationship === 'Conjoint') {
      res = -1
    } else if (b.householdMember?.relationship === 'Conjoint') {
      res = 1
    } else if (a.householdMember?.relationship === 'EnfantMajeur') {
      res = -1
    } else if (b.householdMember?.relationship === 'EnfantMajeur') {
      res = 1
    } else if (a.householdMember?.relationship === 'EnfantMineur') {
      res = -1
    } else if (b.householdMember?.relationship === 'EnfantMineur') {
      res = 1
    }
    return res
  })

  return {
    ...budget,
    remainingAfterExpenses
  }
}
