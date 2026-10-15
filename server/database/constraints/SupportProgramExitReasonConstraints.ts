import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

// All users of a structure can see, create and delete any support program
// exit reason in the same structure.
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.SupportProgramExitReasonWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error(
      'support-program-exit-reason-constraints: missing structure id'
    )
  }

  Object.assign<
    Prisma.SupportProgramExitReasonWhereInput,
    Prisma.SupportProgramExitReasonWhereInput
  >(where, {
    structureId: user.structureId
  })
  return where
}

export const SupportProgramExitReasonConstraints = {
  get,
  create: get,
  update: get,
  delete: get
}
