import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import { BudgetExpensesRepo } from '~/server/database/repository'
import { UpdateBudgetExpensesInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

async function getExpensesWithLoansAndDebts(
  user: SecurityRuleGrantee,
  id: string
) {
  return await BudgetExpensesRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      loans: { select: { id: true } }
    }
  })
}

export async function updateExpenses({
  ctx: { user },
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetExpensesInput
}) {
  const { loans, ...data } = input

  const { loans: previousLoansIds } = await getExpensesWithLoansAndDebts(
    user,
    input.id
  )

  return await BudgetExpensesRepo.update(user, {
    where: { id: input.id },
    data: {
      ...data,
      loans: prepareRelationUpdates(loans, previousLoansIds)
    },
    select: { id: true }
  })
}
