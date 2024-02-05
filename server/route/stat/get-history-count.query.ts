import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { prepareSocialSupportStatFilters } from '~/server/query/stats/helpers'
import {
  getFollowupCountQuery,
  getHelpRequestCountQuery
} from '~/server/query/stats'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
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
