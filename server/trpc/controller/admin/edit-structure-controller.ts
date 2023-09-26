import { prismaClient } from '~/server/prisma'
import { AdminEditStructureInput } from '~/server/schema'
import { editFollowupTypes } from '~/utils/structure'

export const editStructureController = async ({
  input
}: {
  input: AdminEditStructureInput
}) => {
  const {
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes,
    structureId,
    ...structure
  } = input

  await editFollowupTypes(
    structureId,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
  )

  const updatedStructure = await prismaClient.structure.update({
    where: { id: structureId },
    data: structure,
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        }
      },
      users: {
        select: {
          id: true,
          lastName: true,
          firstName: true,
          email: true,
          role: true,
          aidantConnectAuthorisation: true,
          status: true
        }
      }
    }
  })

  return updatedStructure
}
