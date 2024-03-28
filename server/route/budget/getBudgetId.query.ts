import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { getBudgetIdInfoSchema, GetBudgetIdInfoInput } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input: { beneficiaryId },
  ctx
}: {
  input: GetBudgetIdInfoInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getBudgetId({ ctx, beneficiaryId })
}

export const getBudgetId = createQuery({
  inputValidation: getBudgetIdInfoSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
