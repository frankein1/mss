import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export const getFollowupPrescribingOrganizationStatsHandler = async ({
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
      ...prepareFollowupStatFilters(input)
    },
    select: {
      prescribingOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
