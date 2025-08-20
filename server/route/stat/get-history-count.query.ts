import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import { prepareSocialSupportStatFilters } from '~/server/query/stats/helpers'
import {
  getFollowupCountQuery,
  getHelpRequestCountQuery
} from '~/server/query/stats'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { FollowupRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const helpRequests = await getHelpRequestCountQuery(user, input)
  const followups = await getFollowupCountQuery(user, input)

  const firstFollowups = await FollowupRepo.count(user, {
    where: {
      firstFollowup: true,
      socialSupport: prepareSocialSupportStatFilters(input)
    }
  })

  return { helpRequests, followups, firstFollowups }
}

export const getHistoryCountsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
