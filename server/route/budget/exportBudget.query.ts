import { createQuery } from '~/server/route'
import type { GetBudgetInput } from '~/server/schema'
import { getBudgetSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudget } from '~/server/services/budget/getBudget.service'
import { exportBudgetWorkbook } from '~/server/services/budget/exportBudgetSpreadsheet'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

const handler = async ({
  input: { familyFileId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  const budget = await getBudget({ ctx, familyFileId })

  const budgetWorkbook = exportBudgetWorkbook(budget)
  const stream = await createExportFromWorkbook(ctx.user.id, budgetWorkbook)
  return { data: stream.toString('base64') }
}

export const exportBudget = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck,
  handler
})
