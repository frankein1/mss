import { StructureRepo, FollowupTypeRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import {
  AdminEditStructureInput,
  adminEditStructureSchema
} from '~/server/schema'
import { editFollowupTypes } from '~/server/query/structure'

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
    select: {
      id: true
    }
  })

  return updatedStructure
}

export const editAdminStructureMutation = createMutation({
  inputValidation: adminEditStructureSchema,
  adminHandler
})
