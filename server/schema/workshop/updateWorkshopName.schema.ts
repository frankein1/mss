import { z } from 'zod'
import { requiredLimitedStringConstraint } from '../helpers.schema'

export const updateWorkshopNameSchema = z.object({
  id: z.string().uuid(),
  name: requiredLimitedStringConstraint(100)
})

export type UpdateWorkshopNameInput = z.infer<typeof updateWorkshopNameSchema>
