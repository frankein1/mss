import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getMinistereStructureStatsQuery } from '~/server/query/stats'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereStructureStatsQuery(user, input)
}

export const getMinistereStructureStatsPost = createMutation({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
