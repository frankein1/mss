import { createQuery } from '~/server/route'
import {
  ExportHelpRequestsInput,
  exportHelpRequestsSchema
} from '~/server/schema'
import {
  getAppContextPermissions,
  SecurityRuleContext
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { HelpRequestService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const { columns, rows } = await HelpRequestService.exportHelpRequests({
    ctx,
    input
  })

  return await createExport(ctx.user.id, [
    { name: 'Instructions de dossier', columns, rows }
  ])
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.history

export const exportHelpRequests = createQuery({
  securityCheck,
  handler,
  inputValidation: exportHelpRequestsSchema
})
