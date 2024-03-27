import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  updateBudgetExpensesSchema,
  UpdateBudgetExpensesInput
} from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

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
  securityCheck: AllowSecurityCheck,
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
