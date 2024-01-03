import { createQuery } from '~/server/route'
import { ExportFollowupsInput, exportFollowupsSchema } from '~/server/schema'
import { canExportHistory, SecurityRuleGrantee } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { FollowupService } from '~/server/services'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: ExportFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { rows, columns } = await FollowupService.exportFollowups({
    user,
    input
  })

  return await createExport(user.id, [{ name: 'Entretiens', columns, rows }])
}

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: ExportFollowupsInput
) => {
  return canExportHistory(user)
}

export const exportFollowupsQuery = createQuery({
  inputValidation: exportFollowupsSchema,
  securityCheck,
  handler
})
