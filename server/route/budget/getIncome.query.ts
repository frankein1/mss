import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { BudgetIncomeRepo } from '~/server/database'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  try {
    const income = await BudgetIncomeRepo.findUniqueOrThrow(ctx.user, {
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
    return getBudgetPermissions({ ctx, familyFile: income.budget.familyFile })
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
  return await BudgetService.getIncome({ ctx, id })
}

export const getIncome = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
