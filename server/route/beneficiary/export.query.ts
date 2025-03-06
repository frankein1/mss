import { UserActivityType } from '@prisma/client'
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

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, [
    { name: 'Bénéficiaires', columns, rows }
  ])
  return { data: stream.toString('base64') }
}

export const exportBeneficiariesQuery = createQuery({
  inputValidation: exportBeneficiariesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.exportall',
    target: 'Beneficiary',
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.EXPORT
  }
})
