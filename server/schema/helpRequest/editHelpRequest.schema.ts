import { z } from 'zod'
import { createHelpRequestSchema } from './createHelpRequest.schema'

export const editHelpRequestSchema = createHelpRequestSchema.extend({
  id: z.string().uuid()
})

export type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>
