import { z } from 'zod'
import { dateSchema } from '~/utils/zod'

export const quickEditHelpRequestPaymentDateSchema = z.object({
  id: z.string().uuid(),
  paymentDate: dateSchema.nullable()
})

export type QuickEditHelpRequestPaymentDateInput = z.infer<
  typeof quickEditHelpRequestPaymentDateSchema
>
