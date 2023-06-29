import { prismaClient } from '~/server/prisma'

export const getStructureController = async ({
  input: { id }
}: {
  input: { id: string }
}) => {
  return await prismaClient.structure.findUnique({
    where: { id },
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        }
      }
    }
  })
}
