import { z } from 'zod'
import { addFollowupSchemaBase } from './addFollowup.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editFollowupSchema = addFollowupSchemaBase
  .extend({
    id: z.string().uuid(),
    socialSupportId: z.string().uuid()
  })
  .refine(val => !val.isMinistry || val.ministre, {
    message: requiredErrorMessage,
    path: ['ministre']
  })

export type EditFollowupInput = z.infer<typeof editFollowupSchema>
