import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { BudgetExpensesRepo } from '~/server/database'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  try {
    const expenses = await BudgetExpensesRepo.findUniqueOrThrow(ctx.user, {
      select: {
        budget: {
          select: {
            familyFile: {
              select: { structureId: true, referents: { select: { id: true } } }
            }
          }
        }
      },
      where: { id: input.id }
    })
    return getBudgetPermissions({ ctx, familyFile: expenses.budget.familyFile })
      .view
  } catch {
    return false
  }
}

const handler = async ({
  input: { id },
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getExpenses({ ctx, id })
}

export const getExpenses = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
