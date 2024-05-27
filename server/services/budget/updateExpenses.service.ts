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
      loans: { select: { id: true } },
      debts: { select: { id: true } }
    }
  })
}

function filterOutEmptyElements(
  element:
    | UpdateBudgetExpensesInput['loans'][0]
    | UpdateBudgetExpensesInput['debts'][0]
) {
  return Object.entries(element).some(([key, value]) => key !== 'id' && !!value)
}

export async function updateExpenses({
  ctx: { user },
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetExpensesInput
}) {
  const { loans, debts, ...data } = input

  const { loans: previousLoansIds, debts: previousDebtsIds } =
    await getExpensesWithLoansAndDebts(user, input.id)

  return await BudgetExpensesRepo.update(user, {
    where: { id: input.id },
    data: {
      ...data,
      loans: prepareRelationUpdates(
        loans.filter(filterOutEmptyElements),
        previousLoansIds
      ),
      debts: prepareRelationUpdates(
        debts.filter(filterOutEmptyElements),
        previousDebtsIds
      )
    },
    select: { id: true }
  })
}
