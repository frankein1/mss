import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.FamilyFileWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('family-file-constraints: missing structure id')
  }

  Object.assign<Prisma.FamilyFileWhereInput, Prisma.FamilyFileWhereInput>(
    where,
    {
      structureId: user.structureId
    }
  )

  if (isReferent(user)) {
    Object.assign<Prisma.FamilyFileWhereInput, Prisma.FamilyFileWhereInput>(
      where,
      { referents: { some: { id: user.id } } }
    )
  }
  return where
}

export const FamilyFileConstraints = {
  get,
  update: get,
  delete: get
}
