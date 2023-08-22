import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getHelpRequestFollowupTypesStatsQuery } from '~/server/query/stats'

export const getHelpRequestFollowupTypesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestFollowupTypesStatsQuery(user.structureId, input)
}
