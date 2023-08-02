import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getAccommodationModeStatsQuery } from '~/server/query/stats'

export const getAccommodationModeStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getAccommodationModeStatsQuery(user.structureId, input)
}
