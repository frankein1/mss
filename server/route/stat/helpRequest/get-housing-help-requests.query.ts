import { createQuery } from '~/server/route'
import { getHelpRequestHousingStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
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
  return await getHelpRequestHousingStatsQuery(user, input)
}

export const getHousingHelpRequestsStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
