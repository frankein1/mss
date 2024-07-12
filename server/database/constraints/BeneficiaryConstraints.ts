import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId,
    draft: false,
    archived: null
  })

  if (isReferent(user)) {
    Object.assign(where, {
      familyFile: { referents: { some: { id: user.id } } }
    })
  }

  return where
}

const getNoDraftCondition = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId,
    archived: null
  })

  if (isReferent(user)) {
    Object.assign(where, {
      familyFile: { referents: { some: { id: user.id } } }
    })
  }

  return where
}

export const BeneficiaryConstraints = {
  get,
  getNoDraftCondition
}
