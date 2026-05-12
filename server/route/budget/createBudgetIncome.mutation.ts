import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BudgetService } from '~/server/services'
import type { CreateBudgetIncomeInput } from '~/server/schema'
import { createBudgetIncomeSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { BudgetRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateBudgetIncomeInput
) => {
  try {
    const budget = await BudgetRepo.findUniqueOrThrow(ctx.user, {
      select: {
        familyFile: {
          select: { structureId: true, referents: { select: { id: true } } }
        }
      },
      where: { id: input.budgetId }
    })
    return getBudgetPermissions({ ctx, familyFile: budget.familyFile }).edit
  } catch {
    return false
  }
}

const handler = ({
  input,
  ctx: _ctx
}: {
  input: CreateBudgetIncomeInput
  ctx: ProtectedAppContext
}) => BudgetService.createBudgetIncome(input)

export const createBudgetIncome = createMutation({
  inputValidation: createBudgetIncomeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.createBudgetIncome',
    target: 'Budget',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
