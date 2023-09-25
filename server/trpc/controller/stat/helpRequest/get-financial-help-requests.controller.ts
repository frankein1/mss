import { getHelpRequestFinancialStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'

export const getFinancialHelpRequestsStats = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestFinancialStatsQuery(user, input)
}
