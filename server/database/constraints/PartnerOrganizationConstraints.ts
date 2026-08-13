import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.PartnerOrganizationWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('partner-constraints: missing structure id')
  }

  Object.assign<
    Prisma.PartnerOrganizationWhereInput,
    Prisma.PartnerOrganizationWhereInput
  >(where, {
    structureId: user.structureId
  })

  return where
}

export const PartnerOrganizationConstraints = {
  get,
  update: get
}
