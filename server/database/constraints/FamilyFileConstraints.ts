import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.FamilyFileWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId
  })

  if (isReferent(user)) {
    Object.assign(where, { referents: { some: { id: user.id } } })
  }
  return where
}

export const FamilyFileConstraints = {
  get
}
