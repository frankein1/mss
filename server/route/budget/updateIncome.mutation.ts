import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  updateBudgetIncomeSchema,
  UpdateBudgetIncomeInput
} from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBudgetIncomeInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.updateIncome({ ctx, input })
}

export const updateIncome = createMutation({
  inputValidation: updateBudgetIncomeSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'budget.updateIncome',
    target: 'BudgetIncome',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
