import { StructureRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import {
  AdminEditStructureInput,
  adminEditStructureSchema
} from '~/server/schema'

const adminHandler = async ({ input }: { input: AdminEditStructureInput }) => {
  const { structureId, ...structure } = input

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
