import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export const getHelpRequestStatusStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.groupBy({
    by: ['status'],
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestStatFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
