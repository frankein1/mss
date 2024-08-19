import { BudgetIncomeType } from '@prisma/client'
import { BeneficiaryRelativeRepo } from '~/server/database'
import { CreateHostedEntourageMemberInput } from '~/server/schema'

export async function createHostedEntourageMember(
  input: CreateHostedEntourageMemberInput
) {
  const { budgetId, ...memberData } = input

  const member = await BeneficiaryRelativeRepo.prisma.create({
    data: {
      ...memberData,
      hosted: true,
      income: {
        create: {
          type: BudgetIncomeType.HouseholdMember,
          budgetId
        }
      }
    },
    select: { id: true, income: true }
  })

  return { id: member.id, incomeId: member.income?.id }
}
