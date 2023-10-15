import { PaymentMethod } from '@prisma/client'
import { z } from 'zod'
import { withEmptyValueOptionalNativeEnum } from '~/utils/zod'

export const quickEditHelpRequestPaymentMethodSchema = z.object({
  id: z.string().uuid(),
  paymentMethod: withEmptyValueOptionalNativeEnum(PaymentMethod)
})

export type QuickEditHelpRequestPaymentMethodInput = z.infer<
  typeof quickEditHelpRequestPaymentMethodSchema
>
