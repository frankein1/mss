import { getDeltaIncomeExpenses } from './helpers'
import type { SecurityRuleContext } from '~/server/security'
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
    select: {
      id: true,
      created: true,
      updated: true,
      legacyMainIncomeSource: true,
      legacyMainIncomeAmount: true,
      legacyPartnerMainIncomeSource: true,
      legacyPartnerMainIncomeAmount: true,
      legacyMajorChildrenMainIncomeSource: true,
      legacyMajorChildrenMainIncomeAmount: true,
      legacyOtherMembersMainIncomeSource: true,
      legacyOtherMembersMainIncomeAmount: true,
      legacyRemainingAfterExpenses: true,
      numberHouseholdMembers: true,
      savings: true,
      overdraft: true,
      familyQuotient: true,
      banqueDeFrance: true,
      familyFileId: true,
      expenses: {
        select: {
          id: true,
          created: true,
          updated: true,
          budgetId: true,
          rent: true,
          expenses: true,
          water: true,
          electricity: true,
          gas: true,
          fuelOrOther: true,
          housingTax: true,
          propertyTax: true,
          incomeTax: true,
          carInsurance: true,
          homeInsurance: true,
          deathInsurance: true,
          retirementInsurance: true,
          otherInsurance: true,
          remittedAlimony: true,
          healthInsurance: true,
          phoneInternet: true,
          schoolFees: true,
          schoolCanteen: true,
          other: true,
          loans: { orderBy: { created: 'asc' } },
          debts: { orderBy: { created: 'asc' } },
          customs: { orderBy: { created: 'asc' } }
        }
      },
      incomes: {
        select: {
          id: true,
          created: true,
          updated: true,
          budgetId: true,
          salary: true,
          primeActivite: true,
          retirement: true,
          alimony: true,
          disability: true,
          unemployment: true,
          ass: true,
          rsa: true,
          apl: true,
          family: true,
          aah: true,
          aspa: true,
          dailyAllowance: true,
          annuity: true,
          other: true,
          type: true,
          beneficiaryId: true,
          lastName: true,
          firstName: true,
          relationship: true,
          customs: { orderBy: { created: 'asc' } },
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
    } else if (a.relationship === 'Conjoint') {
      res = -1
    } else if (b.relationship === 'Conjoint') {
      res = 1
    } else if (a.relationship === 'EnfantMajeur') {
      res = -1
    } else if (b.relationship === 'EnfantMajeur') {
      res = 1
    } else if (a.relationship === 'EnfantMineur') {
      res = -1
    } else if (b.relationship === 'EnfantMineur') {
      res = 1
    }
    return res
  })

  return {
    ...budget,
    remainingAfterExpenses
  }
}
