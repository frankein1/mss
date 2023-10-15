import { z } from 'zod'

export const quickEditHelpRequestAllocatedAmountSchema = z.object({
  id: z.string().uuid(),
  allocatedAmount: amountNumber.nullable()
})

export type QuickEditHelpRequestAllocatedAmountInput = z.infer<
  typeof quickEditHelpRequestAllocatedAmountSchema
>
