import { createQuery } from '~/server/route'
import {
  ExportBeneficiariesInput,
  exportBeneficiariesSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { BeneficiaryService } from '~/server/services'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.beneficiaries

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const { rows, columns } = await BeneficiaryService.exportBeneficiaries({
    ctx,
    input
  })

  return await createExport(ctx.user.id, [
    { name: 'Entretiens', columns, rows }
  ])
}

export const exportBeneficiariesQuery = createQuery({
  inputValidation: exportBeneficiariesSchema,
  securityCheck,
  handler
})
