import { createQuery } from '~/server/route'
import type { ExportFileInstructionsInput } from '~/server/schema'
import { exportFileInstructionsSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { FileInstructionService, UserService } from '~/server/services'
import { UserActivityType } from '~/prisma/generated/client'

const handler = async ({
  input,
  ctx
}: {
  input: ExportFileInstructionsInput
  ctx: ProtectedAppContext
}) => {
  await UserService.verifyAuthorizationCode({
    ctx,
    input: { code: input.code }
  })

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
  inputValidation: exportFileInstructionsSchema,
  auditLog: {
    key: 'fileInstruction.exportall',
    target: 'FileInstruction',
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.EXPORT
  }
})
