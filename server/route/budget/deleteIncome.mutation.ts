import { UserActivityType } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { idSchema, IdInput } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BudgetIncomeRepo } from '~/server/database'

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  const deleteIncome = BudgetIncomeRepo.prisma.delete({
    where: { id: input.id }
  })
  const updateBudget = BudgetIncomeRepo.update(ctx.user, {
    where: { id: input.id },
    data: {
      budget: {
        update: {
          updated: new Date()
        }
      }
    }
  })

  return await prismaClient.$transaction([deleteIncome, updateBudget])
}

export const deleteIncome = createMutation({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
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
