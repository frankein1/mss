import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { getAppContextPermissions } from '~/server/security/permissions'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { BudgetIncomeRepo, BudgetRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.budget

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  const deletedIncome = await BudgetIncomeRepo.delete(ctx.user, {
    where: { id: input.id },
    select: {
      budgetId: true
    }
  })
  const updatedBudget = await BudgetRepo.update(ctx.user, {
    where: { id: deletedIncome.budgetId },
    data: {
      updated: new Date()
    },
    select: { id: true }
  })

  return updatedBudget
}

export const deleteIncome = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'budget.deleteIncome',
    target: 'BudgetIncome',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
