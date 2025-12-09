import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import {
  BeneficiaryRepo,
  BudgetExpensesRepo,
  WorkshopAttendeeRepo
} from '~/server/database/repository'
import type { UpdateBudgetExpensesInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

async function getExpensesWithLoansAndDebts(
  user: SecurityRuleGrantee,
  id: string
) {
  const expenses = await BudgetExpensesRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      budget: { select: { familyFileId: true } }
    }
  })

  const ben = await BeneficiaryRepo.findMany(user, {
    where: { familyFileId: expenses.budget.familyFileId },
    select: { id: true }
  })

  await WorkshopAttendeeRepo.findUniqueOrThrow(user, {
    where: { id },
    select: { beneficiaryId: true }
  })

  return await BudgetExpensesRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      loans: { select: { id: true } },
      debts: { select: { id: true } },
      customs: { select: { id: true } }
    }
  })
}

function filterOutEmptyElements(
  element:
    | UpdateBudgetExpensesInput['loans'][0]
    | UpdateBudgetExpensesInput['debts'][0]
    | UpdateBudgetExpensesInput['customs'][0]
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
  const { loans, debts, customs, ...data } = input

  const {
    loans: previousLoansIds,
    debts: previousDebtsIds,
    customs: previousCustomExpensesIds
  } = await getExpensesWithLoansAndDebts(user, input.id)

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
      ),
      customs: prepareRelationUpdates(
        customs.filter(filterOutEmptyElements),
        previousCustomExpensesIds
      )
    },
    select: { id: true }
  })
}
