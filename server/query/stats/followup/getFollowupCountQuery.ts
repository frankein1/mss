import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupCountQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.followup.count({
    where: {
      structureId,
      ...prepareFollowupStatFilters(input)
    }
  })
}
