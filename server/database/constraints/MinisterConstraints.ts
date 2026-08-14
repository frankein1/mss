import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const create = (user: SecurityRuleGrantee) => {
  if (!isAdmin(user)) {
    throw new Error('minister-constraints: not admin')
  }
  const data: Partial<Prisma.MinisterEntityCreateInput> = {}
  return data
}

const update = (user: SecurityRuleGrantee) => {
  if (!isAdmin(user)) {
    throw new Error('minister-constraints: not admin')
  }
  const where: Prisma.MinisterEntityWhereInput = {}
  return where
}

const get = () => {
  // no constraints as all type of users can see all ministers
  return {}
}

export const MinisterConstraints = {
  get,
  update,
  create
}
