import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export const getFollowupStatusStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followup.groupBy({
    by: ['status'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
