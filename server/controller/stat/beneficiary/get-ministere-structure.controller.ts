import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getMinistereStructureStatsQuery } from '~/server/query/stats'

export const getMinistereStructureStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereStructureStatsQuery(user.structureId, input)
}
