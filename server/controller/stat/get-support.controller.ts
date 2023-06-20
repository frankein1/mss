import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import {
  prepareFollowupStatFilters,
  prepareHelpRequestStatFilters
} from '~/utils/filters'

export const getSupportStatsHandler = async ({
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
          followups: {
            where: {
              structureId: user.structureId,
              ...prepareFollowupStatFilters(input)
            }
          },
          helpRequests: {
            where: {
              structureId: user.structureId,
              ...prepareHelpRequestStatFilters(input)
            }
          }
        }
      }
    }
  })
}
