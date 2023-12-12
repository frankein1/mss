import { z } from 'zod'
import { dateOrEmpty } from '~/server/schema/helpers.schema'

export const quickEditHelpRequestPaymentDateSchema = z.object({
  id: z.string().uuid(),
  paymentDate: dateOrEmpty
})

export type QuickEditHelpRequestPaymentDateInput = z.infer<
  typeof quickEditHelpRequestPaymentDateSchema
>
