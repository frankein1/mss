import { UserRepo } from '~~/server/database'
import type { Prisma } from '@prisma/client'

export const structureContextSelect = {
  id: true,
  type: true,
  externalRdvspActive: true
} satisfies Prisma.StructureSelect

export const userContextSelect = {
  id: true,
  role: true,
  status: true,
  structureId: true
} satisfies Prisma.UserSelect

export async function fetchUserContext(userId: string) {
  return await UserRepo.prisma.findUniqueOrThrow({
    where: { id: userId },
    select: {
      ...userContextSelect,
      structure: { select: structureContextSelect }
    }
  })
}

export type UserContext = Awaited<ReturnType<typeof fetchUserContext>>
