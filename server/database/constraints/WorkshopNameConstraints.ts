import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

// For now, all users of a structure can see, edit, delete, create any
// workshop name in the same structure.
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopNameWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('workshop-name-constraints: missing structure id')
  }

  Object.assign<Prisma.WorkshopNameWhereInput, Prisma.WorkshopNameWhereInput>(
    where,
    {
      structureId: user.structureId
    }
  )
  return where
}

export const WorkshopNameConstraints = {
  get,
  create: get,
  update: get,
  delete: get
}
