import { UserActivityType } from '~/prisma/generated/client'
import { createQuery } from '~/server/route'
import type { ExportBeneficiariesInput } from '~/server/schema'
import { exportBeneficiariesSchema } from '~/server/schema'
import { BeneficiaryService, UserService } from '~/server/services'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExportFromWorkbook } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  await UserService.verifyAuthorizationCode({
    ctx,
    input: { code: input.code }
  })

  const workbook = await BeneficiaryService.exportWorkbook({ ctx, input })
  const stream = await createExportFromWorkbook(ctx.user.id, workbook)
  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  return { data: stream.toString('base64') }
}

export const exportBeneficiariesQuery = createQuery({
  inputValidation: exportBeneficiariesSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.exportall',
    target: 'Beneficiary',
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.EXPORT
  }
})
