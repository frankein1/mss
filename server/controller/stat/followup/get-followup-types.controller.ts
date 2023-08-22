import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getFollowupFollowupTypesStatsQuery } from '~/server/query/stats'

export const getFollowupFollowupTypesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupFollowupTypesStatsQuery(user.structureId, input)
}
