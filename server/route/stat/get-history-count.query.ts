import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'
import {
  getFollowupCountQuery,
  getHelpRequestCountQuery
} from '~/server/query/stats'
import { AllowSecurityCheck } from '~/server/security'
import { FollowupRepo } from '~/server/database'

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
      ...prepareFollowupStatFilters(input)
    }
  })

  return { helpRequests, followups, firstFollowups }
}

export const getHistoryCountsQuery = createQuery({
  inputValidation: statFilterSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
