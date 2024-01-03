import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const followup = await FollowupService.get({ user, id })

  return followup
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const permissions = await FollowupService.getUpdatePermission(user, input.id)
  return permissions.view
}

export const getFollowupDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
