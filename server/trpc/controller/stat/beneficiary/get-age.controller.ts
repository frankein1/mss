import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getAgeStatsQuery } from '~/server/query/stats'

export const getAgeStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getAgeStatsQuery(user, input)
}
