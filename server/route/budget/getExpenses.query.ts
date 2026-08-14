import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { BudgetService } from '~~/server/services'
import type { SecurityRuleContext } from '~~/server/security/rules/types'
import { getAppContextPermissions } from '~~/server/security/permissions'

const securityCheck = async (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

const handler = async ({
  input: { id },
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getExpenses({ ctx, id })
}

export const getExpenses = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
