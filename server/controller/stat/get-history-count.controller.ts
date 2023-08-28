import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'
import {
  getFollowupCountQuery,
  getHelpRequestCountQuery
} from '~/server/query/stats'

export const getHistoryCountsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  const helpRequests = await getHelpRequestCountQuery(user, input)
  const followups = await getFollowupCountQuery(user, input)
  const firstFollowups = await prismaClient.followup.count({
    where: {
      structureId: user.structureId,
      firstFollowup: true,
      ...prepareFollowupStatFilters(input)
    }
  })
  return { helpRequests, followups, firstFollowups }
}
