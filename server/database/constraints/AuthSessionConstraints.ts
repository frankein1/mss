import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.AuthSessionWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  Object.assign<Prisma.AuthSessionWhereInput, Prisma.AuthSessionWhereInput>(
    where,
    {
      userId: user.id
    }
  )
  return where
}

export const AuthSessionConstraints = {
  get,
  delete: get
}
