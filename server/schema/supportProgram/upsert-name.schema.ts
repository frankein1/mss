import { z } from 'zod'
import { limitedStringConstraint } from '../helpers.schema'

export const upsertSupportProgramNameSchema = z.object({
  id: z.string().uuid().optional(),
  name: limitedStringConstraint(1, 200)
})

export type UpsertSupportProgramNameInput = z.infer<
  typeof upsertSupportProgramNameSchema
>
