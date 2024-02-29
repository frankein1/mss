import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getFollowupSubjectsStatsQuery } from '~/server/query/stats'
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
  return await getFollowupSubjectsStatsQuery(user, input)
}

export const getFollowupSubjectsStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
