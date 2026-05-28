import { UserRepo } from '~/server/database'

export const structureContextSelect = {
  id: true,
  type: true,
  externalRdvspActive: true
} as const

export const userContextSelect = {
  id: true,
  role: true,
  status: true,
  structureId: true
} as const

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
