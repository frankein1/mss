import { getDeltaIncomeExpenses } from './helpers'
import type { SecurityRuleContext } from '~~/server/security'
import { BudgetRepo } from '~~/server/database/repository'

export async function getInfo({
  ctx,
  familyFileId
}: {
  ctx: SecurityRuleContext
  familyFileId: string
}) {
  const infos = await BudgetRepo.findUniqueOrThrow(ctx.user, {
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
          customs: true
        }
      },
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
          loans: true,
          debts: true,
          customs: true
        }
      }
    }
  })

  const { incomes, expenses, ...data } = infos

  const deltaIncomeExpenses = getDeltaIncomeExpenses(incomes, expenses)

  return {
    ...data,
    deltaIncomeExpenses
  }
}
