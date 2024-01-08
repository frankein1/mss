import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema, idSchema, IdInput } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getHelpRequestPermissions } from '~/server/security'
import { HelpRequestService } from '~/server/services'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input?: IdInput
}) => {
  if (!input) {
    return getHelpRequestPermissions({ ctx })
  }

  const permissions = await HelpRequestService.getUpdatePermission(
    ctx,
    input.id
  )
  return permissions
}

export const getHelpRequestPermissionsQuery = createQuery({
  inputValidation: emptySchema.or(idSchema),
  securityCheck: AllowSecurityCheck,
  handler
})
