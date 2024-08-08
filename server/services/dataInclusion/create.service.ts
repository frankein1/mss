import { DataInclusionStructureRepo } from '~/server/database'
import { DataInclusionStructureServerInput } from '~/server/schema'

export async function createStructure(
  structure: DataInclusionStructureServerInput,
  version: string
) {
  return await DataInclusionStructureRepo.prisma.create({
    data: {
      ...structure,
      version
    }
  })
}
