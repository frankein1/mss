import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput } from '~/server/schema'
import { getHelpRequestInstructorOrganizationStatsQuery } from '~/server/query/stats'

export const getInstructorOrganizationStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestInstructorOrganizationStatsQuery(
    user.structureId,
    input
  )
}
