import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestCountQuery(
  structureId: string,
  input: StatFilterInput
) {
  return await prismaClient.helpRequest.count({
    where: {
      structureId,
      ...prepareHelpRequestStatFilters(input)
    }
  })
}
