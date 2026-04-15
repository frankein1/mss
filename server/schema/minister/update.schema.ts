import z from 'zod/v4'
import { createMinisterSchema } from './create.schema'

export const updateMinisterSchema = createMinisterSchema.extend({
  id: z.string().uuid()
})

export type UpdateMinisterInput = z.infer<typeof updateMinisterSchema>
