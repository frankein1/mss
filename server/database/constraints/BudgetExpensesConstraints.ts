import type { Prisma } from '~/prisma/generated/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BudgetExpensesWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('budget-expenses-constraints: missing structure id')
  }

  Object.assign<
    Prisma.BudgetExpensesWhereInput,
    Prisma.BudgetExpensesWhereInput
  >(where, {
    budget: {
      familyFile: {
        structureId: user.structureId
      }
    }
  })

  if (isReferent(user)) {
    Object.assign<
      Prisma.BudgetExpensesWhereInput,
      Prisma.BudgetExpensesWhereInput
    >(where, {
      budget: {
        familyFile: {
          referents: { some: { id: user.id } }
        }
      }
    })
  }
  return where
}

export const BudgetExpensesConstraints = {
  get
}
