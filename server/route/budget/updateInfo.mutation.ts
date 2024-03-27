import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { updateBudgetInfoSchema, UpdateBudgetInfoInput } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

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
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'budget.updateInfo',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
