import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBudgetInfoInput } from '~/server/schema'
import { updateBudgetInfoSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBudgetInfoInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.updateInfo({ ctx, input })
}

export const updateInfo = createMutation({
  inputValidation: updateBudgetInfoSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'budget.updateInfo',
    target: 'Budget',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
