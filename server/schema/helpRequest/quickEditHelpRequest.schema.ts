import { z } from 'zod'
import { quickEditHelpRequestAllocatedAmountSchema } from './quickEditHelpRequestAllocatedAmount.schema'
import { quickEditHelpRequestPaymentMethodSchema } from './quickEditHelpRequestPaymentMethod.schema'
import { quickEditHelpRequestPaymentDateSchema } from './quickEditHelpRequestPaymentDate.schema'

// .strict() is required as payment method may be too permissive
export const quickEditHelpRequestSchema = z.union([
  quickEditHelpRequestAllocatedAmountSchema.strict(),
  quickEditHelpRequestPaymentMethodSchema.strict(),
  quickEditHelpRequestPaymentDateSchema.strict()
])

export type QuickEditHelpRequestInput = z.infer<
  typeof quickEditHelpRequestSchema
>
