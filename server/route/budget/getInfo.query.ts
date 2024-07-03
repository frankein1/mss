import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { getBudgetSchema, GetBudgetInput } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input: { familyFileId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getInfo({ ctx, familyFileId })
}

export const getInfo = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
