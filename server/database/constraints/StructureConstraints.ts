import type { Prisma } from '~/prisma/generated/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.StructureWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('structure-constraints: missing structure id')
  }

  Object.assign<Prisma.StructureWhereInput, Prisma.StructureWhereInput>(where, {
    id: user.structureId
  })
  return where
}

export const StructureConstraints = {
  get
}
