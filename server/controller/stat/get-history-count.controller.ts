import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import {
  prepareFollowupStatFilters,
  prepareHelpRequestStatFilters
} from '~/utils/filters'

export const getHistoryCountsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  const helpRequests = await prismaClient.helpRequest.count({
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestStatFilters(input)
    }
  })
  const followups = await prismaClient.followup.count({
    where: {
      structureId: user.structureId,
      ...prepareFollowupStatFilters(input)
    }
  })
  const firstFollowups = await prismaClient.followup.count({
    where: {
      structureId: user.structureId,
      firstFollowup: true,
      ...prepareFollowupStatFilters(input)
    }
  })
  return { helpRequests, followups, firstFollowups }
}
