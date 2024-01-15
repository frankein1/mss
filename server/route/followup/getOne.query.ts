import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return FollowupService.get({ ctx, id })
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await FollowupService.getEditionPermissions(ctx, input.id)
  return permissions.view
}

export const getOne = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
