import { prismaClient } from '~/server/prisma'
import type { ProtectedAppContextUser } from '~/server/trpc'

export async function getUserStructureType(user: ProtectedAppContextUser) {
  const structure = await prismaClient.structure.findUnique({
    where: {
      id: user.structureId || ''
    },
    select: { type: true }
  })

  return structure?.type
}
