import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export const getHelpRequestFollowupTypesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          helpRequests: {
            where: {
              structureId: user.structureId,
              ...prepareHelpRequestStatFilters(input)
            }
          }
        }
      }
    },
    orderBy: [{ helpRequests: { _count: 'desc' } }]
  })
}
