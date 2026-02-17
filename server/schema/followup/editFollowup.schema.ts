import { z } from 'zod'
import { addFollowupSchemaBase } from './addFollowup.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editFollowupSchema = addFollowupSchemaBase
  .extend({
    id: z.string().uuid(),
    socialSupportId: z.string().uuid()
  })
  .refine(val => !val.isMinistry || val.ministerId, {
    message: requiredErrorMessage,
    path: ['ministerId']
  })

export type EditFollowupInput = z.infer<typeof editFollowupSchema>
