import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const getCurrentUserStructureHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  const { structureId } = user

  return await prismaClient.structure.findUnique({
    where: { id: structureId },
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      }
    }
  })
}
