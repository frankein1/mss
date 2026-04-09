import { prismaClient } from '~/server/prisma'

export async function countStructures() {
  return await prismaClient.dataInclusionStructureV1.count()
}
