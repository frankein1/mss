import { z } from 'zod'

export const quickEditHelpRequestPaymentDateSchema = z.object({
  id: z.string().uuid(),
  paymentDate: z.coerce.date().nullable()
})

export type QuickEditHelpRequestPaymentDateInput = z.infer<
  typeof quickEditHelpRequestPaymentDateSchema
>
