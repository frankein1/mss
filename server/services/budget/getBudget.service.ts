import { getDeltaIncomeExpenses } from './helpers'
import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'
import { prismaDecimalToNumber } from '~/utils/prisma'

export async function getBudget({
  ctx,
  familyFileId
}: {
  ctx: SecurityRuleContext
  familyFileId: string
}) {
  const budget = await BudgetRepo.findUniqueOrThrow(ctx.user, {
    where: { familyFileId },
    include: {
      expenses: {
        include: {
          loans: { orderBy: { created: 'asc' } },
          debts: { orderBy: { created: 'asc' } }
        }
      },
      incomes: {
        include: {
          householdMember: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              birthDate: true,
              relationship: true,
              hosted: true
            }
          },
          beneficiary: {
            select: {
              id: true,
              firstName: true,
              usualName: true,
              birthName: true,
              birthDate: true,
              relationship: true
            }
          }
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
    nMembers === undefined ||
    nMembers === 0 ||
    isNaN(nMembers) ||
    deltaIncomeExpenses === null
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
