import { BudgetIncomeType, Prisma } from '@prisma/client'
import { BudgetIncomeRepo } from '~/server/database'
import { CreateBudgetIncomeInput } from '~/server/schema'

export async function createBudgetIncome(input: CreateBudgetIncomeInput) {
  const { budgetId, member, beneficiaryId } = input

  const data: Prisma.BudgetIncomeUncheckedCreateInput = {
    type: BudgetIncomeType.HouseholdMember,
    budgetId
  }
  if (beneficiaryId && beneficiaryId !== 'other') {
    data.beneficiaryId = beneficiaryId
  } else if (member) {
    data.firstName = member.firstName
    data.lastName = member.lastName
    data.relationship = member.relationship
  } else {
    throw new Error('One of beneficiaryId or member props is compulsory')
  }
  const income = await BudgetIncomeRepo.prisma.create({
    data,
    select: { id: true }
  })

  return { id: income.id }
}
