import type { Prisma } from '@prisma/client'
import { BudgetIncomeType } from '@prisma/client'
import { BudgetIncomeRepo } from '~/server/database'
import type { CreateBudgetIncomeInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security'
import { BUDGET_INCOME_FOR_MEMBER_VALUE } from '~/utils/constants/income'

export async function createBudgetIncome(
  user: SecurityRuleGrantee,
  input: CreateBudgetIncomeInput
) {
  const { budgetId, member, beneficiaryId } = input

  const data: Prisma.BudgetIncomeUncheckedCreateInput = {
    type: BudgetIncomeType.HouseholdMember,
    budgetId
  }
  if (beneficiaryId && beneficiaryId !== BUDGET_INCOME_FOR_MEMBER_VALUE) {
    data.beneficiaryId = beneficiaryId
  } else if (member) {
    data.firstName = member.firstName
    data.lastName = member.lastName
    data.relationship = member.relationship
  } else {
    throw new Error('One of beneficiaryId or member props is compulsory')
  }
  const income = await BudgetIncomeRepo.create(user, {
    data,
    select: { id: true }
  })

  return { id: income.id }
}
