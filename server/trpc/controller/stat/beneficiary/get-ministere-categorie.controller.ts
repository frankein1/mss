import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getMinistereCategorieStatsQuery } from '~/server/query/stats'

export const getMinistereCategorieStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereCategorieStatsQuery(user, input)
}
