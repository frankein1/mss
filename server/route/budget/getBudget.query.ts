import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { getBudgetSchema, GetBudgetInput } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input: { beneficiaryId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getBudget({ ctx, beneficiaryId })
}

export const getBudget = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
