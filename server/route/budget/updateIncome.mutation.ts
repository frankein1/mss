import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBudgetIncomeInput } from '~/server/schema'
import { updateBudgetIncomeSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

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
  securityCheck,
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
