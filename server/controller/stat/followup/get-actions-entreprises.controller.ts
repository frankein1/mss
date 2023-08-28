import { getFollowupActionsEntreprisesStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'

export const getFollowupActionsEntreprisesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupActionsEntreprisesStatsQuery(user, input)
}
