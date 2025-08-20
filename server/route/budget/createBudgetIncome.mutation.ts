import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BudgetService } from '~/server/services'
import type { CreateBudgetIncomeInput } from '~/server/schema'
import { createBudgetIncomeSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

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
