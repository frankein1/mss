import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return FollowupService.get({ user, id })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const permissions = await FollowupService.getUpdatePermission(user, input.id)
  return permissions.view
}

export const getOne = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
