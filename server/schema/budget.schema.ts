import { z } from 'zod'
import { amountNumber } from '.'

export const updateBudgetInfoSchema = z.object({
  id: z.string().uuid(),
  remainingAfterExpenses: amountNumber.nullish(),
  savings: amountNumber.nullish(),
  overdraft: amountNumber.nullish(),
  familyQuotient: amountNumber.nullish()
})

export type UpdateBudgetInfoInput = z.infer<typeof updateBudgetInfoSchema>
