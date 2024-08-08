import { DataInclusionStructureRepo } from '~/server/database'

export async function countStructures() {
  return await DataInclusionStructureRepo.prisma.count()
}
