import type { SecurityRuleContext } from '~/server/security'
import { BudgetIncomeRepo } from '~/server/database/repository'

export async function getIncome({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) {
  return await BudgetIncomeRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
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
      },
      budget: {
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
          familyFileId: true
        }
      }
    }
  })
}
