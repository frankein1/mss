import { z } from 'zod/v4'
import { addFollowupSchemaBase } from './addFollowup.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editFollowupSchema = addFollowupSchemaBase
  .extend({
    id: z.uuid(),
    socialSupportId: z.uuid()
  })
  .refine(val => !val.isMinistry || val.ministre, {
    message: requiredErrorMessage,
    path: ['ministre']
  })

export type EditFollowupInput = z.infer<typeof editFollowupSchema>
