import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBudgetExpensesInput } from '~/server/schema'
import { updateBudgetExpensesSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { BudgetExpensesRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBudgetExpensesInput
) => {
  try {
    const expenses = await BudgetExpensesRepo.findUniqueOrThrow(ctx.user, {
      select: {
        budget: {
          select: {
            familyFile: {
              select: { structureId: true, referents: { select: { id: true } } }
            }
          }
        }
      },
      where: { id: input.id }
    })
    return getBudgetPermissions({ ctx, familyFile: expenses.budget.familyFile })
      .edit
  } catch {
    return false
  }
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBudgetExpensesInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.updateExpenses({ ctx, input })
}

export const updateExpenses = createMutation({
  inputValidation: updateBudgetExpensesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'budget.updateExpenses',
    target: 'BudgetExpenses',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
