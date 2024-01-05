import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema, idSchema, IdInput } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getHelpRequestPermissions } from '~/server/security'
import { getHelpRequestSecurityTarget } from '~/server/query'

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

  const target = await getHelpRequestSecurityTarget(ctx.user, input.id)

  return getHelpRequestPermissions({ ctx, target })
}

export const getHelpRequestPermissionsQuery = createQuery({
  inputValidation: emptySchema.or(idSchema),
  securityCheck: AllowSecurityCheck,
  handler
})
