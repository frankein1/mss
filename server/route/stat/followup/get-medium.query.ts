import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { getFollowupMediumStatsQuery } from '~/server/query/stats'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
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
  return await getFollowupMediumStatsQuery(user, input)
}

export const getFollowupMediumStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
