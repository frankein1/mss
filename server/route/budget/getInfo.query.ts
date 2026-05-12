import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { GetBudgetInput } from '~/server/schema'
import { getBudgetSchema } from '~/server/schema'
import { BudgetService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { getBudgetPermissions } from '~/server/security/permissions'
import { FamilyFileRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetBudgetInput
) => {
  try {
    const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
      select: { structureId: true, referents: { select: { id: true } } },
      where: { id: input.familyFileId }
    })
    return getBudgetPermissions({ ctx, familyFile }).view
  } catch {
    return false
  }
}

const handler = async ({
  input: { familyFileId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  return await BudgetService.getInfo({ ctx, familyFileId })
}

export const getInfo = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck,
  handler
})
