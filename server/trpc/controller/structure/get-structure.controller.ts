import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const getCurrentUserStructureHandler = async ({
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.structure.findUnique({
    where: { id: structure.id },
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
