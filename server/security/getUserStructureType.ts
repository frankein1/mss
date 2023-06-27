import { prismaClient } from '~/server/prisma'
import type { ProtectedAppContext } from '~/server/trpc'

export async function getUserStructureType(user: ProtectedAppContext['user']) {
  const structure = await prismaClient.structure.findUnique({
    where: {
      id: user.structureId
    },
    select: { type: true }
  })

  return structure?.type
}
