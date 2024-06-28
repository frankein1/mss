import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BudgetExpensesWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<
    Prisma.BudgetExpensesWhereInput,
    Prisma.BudgetExpensesWhereInput
  >(where, {
    budget: {
      familyFile: {
        structureId: user.structureId || undefined
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
