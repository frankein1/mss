import { prismaClient } from '~/server/prisma'

export async function getStructureStatusInDB(id: string, updateDate: Date) {
  const structure = await prismaClient.dataInclusionStructureV1.findFirst({
    select: { updated: true },
    where: { id }
  })

  const exists = structure !== null
  const shouldBeUpdated =
    exists &&
    structure.updated &&
    structure.updated.getTime() < updateDate.getTime()

  return { exists, shouldBeUpdated }
}
