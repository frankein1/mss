import { ProtectedAppContext } from '~/server/trpc'
import { getFollowupMediumStatsQuery } from '~/server/query/stats'
import { StatFilterInput } from '~/server/schema'

export const getFollowupMediumStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupMediumStatsQuery(user.structureId, input)
}
