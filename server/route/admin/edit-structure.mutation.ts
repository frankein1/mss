import { StructureRepo, FollowupTypeRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import {
  AdminEditStructureInput,
  adminEditStructureSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { editFollowupTypes } from '~/utils/structure'

const adminHandler = async ({ input }: { input: AdminEditStructureInput }) => {
  const {
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes,
    structureId,
    ...structure
  } = input

  const currentFollowupTypes = await FollowupTypeRepo.prisma.findMany({
    where: {
      ownedByStructureId: structureId
    },
    include: {
      _count: {
        select: { followups: true, helpRequests: true }
      }
    }
  })

  await editFollowupTypes(
    structureId,
    currentFollowupTypes,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
  )

  const updatedStructure = await StructureRepo.prisma.update({
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

export const editAdminStructureMutation = createMutation({
  inputValidation: adminEditStructureSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
