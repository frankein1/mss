import { z } from 'zod'
import { quickEditHelpRequestStatusSchema } from './quickEditHelpRequestStatus.schema'
import { quickEditHelpRequestAllocatedAmountSchema } from './quickEditHelpRequestAllocatedAmount.schema'
import { quickEditHelpRequestPaymentMethodSchema } from './quickEditHelpRequestPaymentMethod.schema'
import { quickEditHelpRequestPaymentDateSchema } from './quickEditHelpRequestPaymentDate.schema'

export const quickEditHelpRequestSchema = z.union([
  quickEditHelpRequestStatusSchema,
  quickEditHelpRequestAllocatedAmountSchema,
  quickEditHelpRequestPaymentMethodSchema,
  quickEditHelpRequestPaymentDateSchema
])

export type QuickEditHelpRequestInput = z.infer<
  typeof quickEditHelpRequestSchema
>
