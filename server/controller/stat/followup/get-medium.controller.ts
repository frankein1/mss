import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export const getFollowupMediumStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followup.groupBy({
    by: ['medium'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { medium: 'desc' } }
  })
}
