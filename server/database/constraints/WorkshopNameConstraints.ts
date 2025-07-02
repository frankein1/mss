import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

// For now, all users of a structure can see, edit, delete, create any
// workshop name in the same structure.
// TODO: make sure that's what we want
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopNameWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId
  })
  return where
}

export const WorkshopNameConstraints = {
  get,
  create: get,
  update: get,
  delete: get
}
