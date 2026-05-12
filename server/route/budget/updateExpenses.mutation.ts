import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBudgetExpensesInput } from '~/server/schema'
import { updateBudgetExpensesSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

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
