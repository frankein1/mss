import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.SupportProgramNameWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('support-program-name-constraints: missing structure id')
  }

  Object.assign<
    Prisma.SupportProgramNameWhereInput,
    Prisma.SupportProgramNameWhereInput
  >(where, { structureId: user.structureId })
  return where
}

export const SupportProgramNameConstraints = {
  get,
  create: get,
  update: get,
  delete: get
}
