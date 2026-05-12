import { createQuery } from '~/server/route'
import type { GetBudgetInput } from '~/server/schema'
import { getBudgetSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudget } from '~/server/services/budget/getBudget.service'
import { exportBudgetWorkbook } from '~/server/services/budget/exportBudgetSpreadsheet'
import { getBudgetPermissions } from '~/server/security/permissions'
import { FamilyFileRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetBudgetInput
) => {
  try {
    const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
      select: { structureId: true, referents: { select: { id: true } } },
      where: { id: input.familyFileId }
    })
    return getBudgetPermissions({ ctx, familyFile }).view
  } catch {
    return false
  }
}

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
