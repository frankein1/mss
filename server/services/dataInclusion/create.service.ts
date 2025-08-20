import { DataInclusionStructureRepo } from '~/server/database'
import type { DataInclusionStructureServerInput } from '~/server/schema'

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
