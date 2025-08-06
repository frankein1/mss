import { z } from 'zod/v4'
import { requiredLimitedStringConstraint } from '../helpers.schema'

export const updateWorkshopNameSchema = z.object({
  id: z.uuid(),
  name: requiredLimitedStringConstraint(100)
})

export type UpdateWorkshopNameInput = z.infer<typeof updateWorkshopNameSchema>
