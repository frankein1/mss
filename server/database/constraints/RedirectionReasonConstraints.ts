import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

// All users of a structure can see, edit, delete, create any
// redirection reason in the same structure.
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.RedirectionReasonWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('redirection-reason-constraints: missing structure id')
  }

  Object.assign<
    Prisma.RedirectionReasonWhereInput,
    Prisma.RedirectionReasonWhereInput
  >(where, {
    structureId: user.structureId
  })
  return where
}

export const RedirectionReasonConstraints = {
  get
}
