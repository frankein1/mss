import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getAccommodationZoneStatsQuery } from '~/server/query/stats'

export const getAccommodationZoneStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getAccommodationZoneStatsQuery(user.structureId, input)
}
