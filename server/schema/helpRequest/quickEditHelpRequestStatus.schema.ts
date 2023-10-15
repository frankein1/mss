import { HelpRequestStatus } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum } from '~/utils/zod'

export const quickEditHelpRequestStatusSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(HelpRequestStatus)
})

export type QuickEditHelpRequestStatusInput = z.infer<
  typeof quickEditHelpRequestStatusSchema
>
