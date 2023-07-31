import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getFamilyStatsQuery } from '~/server/query/stats'

export const getFamilyStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFamilyStatsQuery(user.structureId, input)
}
