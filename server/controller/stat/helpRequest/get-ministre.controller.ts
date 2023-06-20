import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export const getHelpRequestMinistreStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.helpRequest.groupBy({
    by: ['ministre'],
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
