import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export const getFollowupMinistreStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.groupBy({
    by: ['ministre'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
