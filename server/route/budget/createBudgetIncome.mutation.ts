import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BudgetService } from '~/server/services'
import type { CreateBudgetIncomeInput } from '~/server/schema'
import { createBudgetIncomeSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { BeneficiaryRepo, BudgetRepo } from '~/server/database'
import { BUDGET_INCOME_FOR_MEMBER_VALUE } from '~/utils/constants/income'

/** Validate that budgetId and beneficiaryId (optional) belong to the structure */
const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateBudgetIncomeInput
) => {
  const hasBeneficiaryId =
    !!input.beneficiaryId &&
    input.beneficiaryId !== BUDGET_INCOME_FOR_MEMBER_VALUE
  try {
    await Promise.all([
      BudgetRepo.findUniqueOrThrow(ctx.user, {
        select: { id: true },
        where: { id: input.budgetId }
      }),
      ...(hasBeneficiaryId
        ? [
            BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
              select: { id: true },
              where: { id: input.beneficiaryId }
            })
          ]
        : [])
    ])
  } catch {
    return false
  }
  return true
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
