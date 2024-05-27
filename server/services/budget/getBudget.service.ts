import { SecurityRuleContext } from '~/server/security'
import { BudgetRepo } from '~/server/database/repository'

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

  budget.incomes.sort((a, b) => {
    if (a.type === 'Beneficiary') {
      return -1
    }
    if (b.type === 'Beneficiary') {
      return 1
    }
    if (a.householdMember?.relationship === 'Conjoint') {
      return -1
    }
    if (b.householdMember?.relationship === 'Conjoint') {
      return 1
    }
    if (a.householdMember?.relationship === 'EnfantMajeur') {
      return -1
    }
    if (b.householdMember?.relationship === 'EnfantMajeur') {
      return 1
    }
    if (a.householdMember?.relationship === 'EnfantMineur') {
      return -1
    }
    if (b.householdMember?.relationship === 'EnfantMineur') {
      return 1
    }
    return 0
  })

  return budget
}
