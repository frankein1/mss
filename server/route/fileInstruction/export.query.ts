import { createQuery } from '~/server/route'
import {
  ExportFileInstructionsInput,
  exportFileInstructionsSchema
} from '~/server/schema'
import {
  getAppContextPermissions,
  SecurityRuleContext
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { FileInstructionService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: ExportFileInstructionsInput
  ctx: ProtectedAppContext
}) => {
  const { columns, rows } = await FileInstructionService.exportFileInstructions(
    {
      ctx,
      input
    }
  )
  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658
  // & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const stream = await createExport(ctx.user.id, [
    { name: 'Instructions de dossier', columns, rows }
  ])
  return { data: stream.toString('base64') }
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.history

export const exportFileInstructions = createQuery({
  securityCheck,
  handler,
  inputValidation: exportFileInstructionsSchema
})
