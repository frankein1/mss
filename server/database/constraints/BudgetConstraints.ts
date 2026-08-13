import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin, isReferent } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BudgetWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('budget-constraints: missing structure id')
  }

  Object.assign<Prisma.BudgetWhereInput, Prisma.BudgetWhereInput>(where, {
    familyFile: {
      structureId: user.structureId
    }
  })

  if (isReferent(user)) {
    Object.assign<Prisma.BudgetWhereInput, Prisma.BudgetWhereInput>(where, {
      familyFile: {
        referents: { some: { id: user.id } }
      }
    })
  }
  return where
}

export const BudgetConstraints = {
  get
}
