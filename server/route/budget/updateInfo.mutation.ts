import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBudgetInfoInput } from '~/server/schema'
import { updateBudgetInfoSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { BudgetRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBudgetInfoInput
) => {
  try {
    const budget = await BudgetRepo.findUniqueOrThrow(ctx.user, {
      select: {
        familyFile: {
          select: { structureId: true, referents: { select: { id: true } } }
        }
      },
      where: { id: input.id }
    })
    return getBudgetPermissions({ ctx, familyFile: budget.familyFile }).edit
  } catch {
    return false
  }
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBudgetInfoInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.updateInfo({ ctx, input })
}

export const updateInfo = createMutation({
  inputValidation: updateBudgetInfoSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'budget.updateInfo',
    target: 'Budget',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
