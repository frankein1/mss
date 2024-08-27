import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { idSchema, IdInput } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.deleteIncome({ ctx, input })
}

export const deleteIncome = createMutation({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'budget.deleteIncome',
    target: 'BudgetIncome',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
