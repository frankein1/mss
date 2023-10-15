import { z } from 'zod'
import { amountNumber } from '~/utils/zod'

export const quickEditHelpRequestAllocatedAmountSchema = z.object({
  id: z.string().uuid(),
  allocatedAmount: amountNumber.nullable()
})

export type QuickEditHelpRequestAllocatedAmountInput = z.infer<
  typeof quickEditHelpRequestAllocatedAmountSchema
>
