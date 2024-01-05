import { getHelpRequestAccessibleData } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  getHelpRequestPermissions
} from '~/server/security'
import {
  getHelpRequestWithRelations,
  getHelpRequestSecurityTarget
} from '~/server/query/helpRequests'
import { IdInput, idSchema } from '~/server/schema'

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
  const helpRequest = await getHelpRequestWithRelations(user, id)
  const permissions = getHelpRequestPermissions({
    ctx,
    target: helpRequest
  })

  const data = getHelpRequestAccessibleData(permissions, helpRequest)

  return { data, permissions }
}

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const target = await getHelpRequestSecurityTarget(ctx.user, input.id)
  const permissions = getHelpRequestPermissions({ ctx, target })
  return permissions.view
}

export const getHelpRequestDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
