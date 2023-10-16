import { HelpRequestStatus } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum } from '../helpers.schema'

export const quickEditHelpRequestStatusSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(HelpRequestStatus)
})

export type QuickEditHelpRequestStatusInput = z.infer<
  typeof quickEditHelpRequestStatusSchema
>
