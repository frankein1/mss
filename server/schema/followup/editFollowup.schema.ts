import { z } from 'zod'
import { addFollowupSchema } from './addFollowup.schema'

export const editFollowupSchema = addFollowupSchema.extend({
  id: z.string().uuid()
})

export type EditFollowupInput = z.infer<typeof editFollowupSchema>
