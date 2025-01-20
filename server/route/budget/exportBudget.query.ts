import { createQuery } from '~/server/route'
import { GetBudgetInput, getBudgetSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getBudget } from '~/server/services/budget/getBudget.service'
import { exportBudgetSpreadsheet } from '~/server/services/budget/exportBudgetSpreadsheet'

const handler = async ({
  input: { familyFileId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  const budget = await getBudget({ ctx, familyFileId })
  const exportData = exportBudgetSpreadsheet(budget)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, exportData)
  return { data: stream.toString('base64') }
}

export const exportBudget = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
