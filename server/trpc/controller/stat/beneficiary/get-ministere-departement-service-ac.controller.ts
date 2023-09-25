import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getMinistereDepartementServiceAcStatsQuery } from '~/server/query/stats'

export const getMinistereDepartementServiceAcStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereDepartementServiceAcStatsQuery(user, input)
}
