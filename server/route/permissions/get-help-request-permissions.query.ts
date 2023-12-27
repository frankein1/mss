import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema, idSchema, IdInput } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getHelpRequestPermissions } from '~/server/security'
import { getHelpRequestSecurityTarget } from '~/server/query'

const handler = async ({
  ctx: { user, structure },
  input
}: {
  ctx: ProtectedAppContext
  input?: IdInput
}) => {
  if (!input) {
    return getHelpRequestPermissions({ user, structure })
  }

  const target = await getHelpRequestSecurityTarget(user, input.id)

  return getHelpRequestPermissions({ user, structure, target })
}

export const getHelpRequestPermissionsQuery = createQuery({
  inputValidation: emptySchema.or(idSchema),
  securityCheck: AllowSecurityCheck,
  handler
})
