import { getHelpRequestPrescribingOrganizationStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'

export const getHelpRequestPrescribingOrganizationStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestPrescribingOrganizationStatsQuery(
    user.structureId,
    input
  )
}
