import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export const getFollowupActionsEntreprisesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.findMany({
    where: {
      structureId: user.structureId,
      OR: [{ redirected: true }, { helpRequested: true }],
      ...prepareFollowupStatFilters(input)
    },
    select: {
      redirected: true,
      helpRequested: true
    }
  })
}
