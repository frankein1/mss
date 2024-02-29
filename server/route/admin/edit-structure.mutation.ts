import { StructureRepo, SocialSupportSubjectRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import {
  AdminEditStructureInput,
  adminEditStructureSchema
} from '~/server/schema'
import { editSocialSupportSubjects } from '~/server/query/structure'

const adminHandler = async ({ input }: { input: AdminEditStructureInput }) => {
  const {
    legallyRequiredSocialSupportSubjects,
    legallyNotRequiredSocialSupportSubjects,
    structureId,
    ...structure
  } = input

  const currentSocialSupportSubjects =
    await SocialSupportSubjectRepo.prisma.findMany({
      where: {
        ownedByStructureId: structureId
      }
    })

  await editSocialSupportSubjects(
    structureId,
    currentSocialSupportSubjects,
    legallyRequiredSocialSupportSubjects,
    legallyNotRequiredSocialSupportSubjects
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
