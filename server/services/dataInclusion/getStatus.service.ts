import { DataInclusionStructureRepo } from '~/server/database'

export async function getStructureStatusInDB(id: string, updateDate: Date) {
  const structure = await DataInclusionStructureRepo.prisma.findFirst({
    where: { id }
  })

  const exists = structure !== null
  const shouldBeUpdated =
    exists &&
    structure.updated &&
    structure.updated.getTime() < updateDate.getTime()

  return { exists, shouldBeUpdated }
}
