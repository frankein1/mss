import { getHelpRequestMinistreStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'

export const getHelpRequestMinistreStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestMinistreStatsQuery(user, input)
}
