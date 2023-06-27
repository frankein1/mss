import { User, Prisma } from '@prisma/client'
import { canViewAnyFollowupDetails } from '~/server/security/rules'

export function prepareGetFollowupsPageSelect(user: User) {
  return {
    id: true,
    status: true,
    medium: true,
    types: {
      select: { id: true, name: true },
      orderBy: { name: Prisma.SortOrder.asc }
    },
    dueDate: canViewAnyFollowupDetails(user),
    beneficiary: {
      select: {
        id: true,
        fileNumber: true,
        firstName: true,
        birthName: true,
        usualName: true,
        email: true,
        referents: true,
        structureId: true
      }
    },
    createdBy: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    },
    structureId: true
  }
}
