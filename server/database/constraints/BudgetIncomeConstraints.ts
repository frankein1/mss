import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BudgetIncomeWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('budget-income-constraints: missing structure id')
  }

  Object.assign<Prisma.BudgetIncomeWhereInput, Prisma.BudgetIncomeWhereInput>(
    where,
    {
      budget: {
        familyFile: {
          structureId: user.structureId
        }
      }
    }
  )

  if (isReferent(user)) {
    Object.assign<Prisma.BudgetIncomeWhereInput, Prisma.BudgetIncomeWhereInput>(
      where,
      {
        budget: {
          familyFile: {
            referents: { some: { id: user.id } }
          }
        }
      }
    )
  }
  return where
}

export const BudgetIncomeConstraints = {
  get,
  create: get,
  delete: get,
  update: get
}
