import { FollowupStatus } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum } from '../helpers.schema'

export const quickEditFollowupSchema = z.object({
  id: z.string().uuid(),
  status: requiredNativeEnum(FollowupStatus)
})

export type QuickEditFollowupInput = z.infer<typeof quickEditFollowupSchema>
