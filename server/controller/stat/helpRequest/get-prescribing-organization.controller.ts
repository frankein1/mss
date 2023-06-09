import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export const getHelpRequestPrescribingOrganizationStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.findMany({
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestStatFilters(input)
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
