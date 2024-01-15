import { createQuery } from '~/server/route'
import { ExportFollowupsInput, exportFollowupsSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { FollowupService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: ExportFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { rows, columns } = await FollowupService.exportFollowups({
    ctx,
    input
  })

  return await createExport(ctx.user.id, [
    { name: 'Entretiens', columns, rows }
  ])
}

const securityCheck = (
  ctx: SecurityRuleContext,
  _input: ExportFollowupsInput
) => {
  return getAppContextPermissions(ctx).export.history
}

export const getExport = createQuery({
  inputValidation: exportFollowupsSchema,
  securityCheck,
  handler
})
