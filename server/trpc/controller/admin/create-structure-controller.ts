import { prismaClient } from '~/server/prisma'
import { AdminCreateStructureInput } from '~/server/schema'

export const createStructureController = async ({
  input
}: {
  input: AdminCreateStructureInput
}) => {
  const createdStructure = await prismaClient.structure.create({
    data: input,
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

  return createdStructure
}
