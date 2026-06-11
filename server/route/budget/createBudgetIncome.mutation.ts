import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BudgetService } from '~/server/services'
import type { CreateBudgetIncomeInput } from '~/server/schema'
import { createBudgetIncomeSchema } from '~/server/schema'
import {
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import { getAppContextPermissions } from '~/server/security/permissions'
import { BeneficiaryRepo, BudgetRepo } from '~/server/database'
import { BUDGET_INCOME_FOR_MEMBER_VALUE } from '~/utils/constants/income'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateBudgetIncomeInput
) => {
  if (!getAppContextPermissions(ctx).budget.access) {
    return false
  }

  const hasBeneficiaryId =
    !!input.beneficiaryId &&
    input.beneficiaryId !== BUDGET_INCOME_FOR_MEMBER_VALUE

  const [budgetInStructure, beneficiaryInStructure] = await Promise.all([
    validateOneBelongsToStructure(
      ctx.user,
      input.budgetId,
      BudgetRepo.findUniqueOrThrow
    ),
    hasBeneficiaryId
      ? validateOneBelongsToStructure(
          ctx.user,
          input.beneficiaryId,
          BeneficiaryRepo.findUniqueOrThrow
        )
      : true
  ])

  return budgetInStructure && beneficiaryInStructure
}

const handler = ({
  input,
  ctx
}: {
  input: CreateBudgetIncomeInput
  ctx: ProtectedAppContext
}) => BudgetService.createBudgetIncome(ctx.user, input)

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
