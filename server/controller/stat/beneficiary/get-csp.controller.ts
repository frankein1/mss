import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getCSPStatsQuery } from '~/server/query/stats'

export const getCSPStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getCSPStatsQuery(user.structureId, input)
}
