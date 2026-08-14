import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.UserWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  // A non admin user should always have structure id filled
  if (!user.structureId) {
    throw new Error('user-constraints: missing structure id')
  }

  Object.assign<Prisma.UserWhereInput, Prisma.UserWhereInput>(where, {
    structureId: user.structureId
  })
  return where
}

export const UserConstraints = {
  get,
  update: get
}
