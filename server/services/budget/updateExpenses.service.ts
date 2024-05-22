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
      loansDetails: { select: { id: true } }
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
  const { loansDetails, ...data } = input

  const { loansDetails: previousLoansIds } = await getExpensesWithLoansAndDebts(
    user,
    input.id
  )

  return await BudgetExpensesRepo.update(user, {
    where: { id: input.id },
    data: {
      ...data,
      loansDetails: prepareRelationUpdates(loansDetails, previousLoansIds)
    },
    select: { id: true }
  })
}
