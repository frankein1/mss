import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getGenderStatsQuery } from '~/server/query/stats'

export const getGenderStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getGenderStatsQuery(user.structureId, input)
}
