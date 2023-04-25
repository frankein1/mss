import { prismaClient } from '~/server/prisma'

const get = (structureId: string) =>
  prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId },
    include: {
      proposedFollowupTypes: {
        select: {
          followupType: {
            select: { id: true, name: true, legallyRequired: true }
          }
        }
      }
    }
  })

export { get }
