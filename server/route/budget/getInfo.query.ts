import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { GetBudgetInput } from '~/server/schema'
import { getBudgetSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

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
  securityCheck,
  handler
})
