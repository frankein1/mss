import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { HelpRequestService } from '~~/server/services'

const handler = ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.get({ ctx, id })
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await HelpRequestService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view
}

export const getOne = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
