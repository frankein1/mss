import { DataInclusionStructureRepo } from '~/server/database'
import { DataInclusionStructureServerInput } from '~/server/schema'

export async function updateStructure(
  structure: DataInclusionStructureServerInput,
  version: string
) {
  return await DataInclusionStructureRepo.prisma.update({
    where: { id: structure.id },
    data: {
      ...structure,
      version
    }
  })
}
