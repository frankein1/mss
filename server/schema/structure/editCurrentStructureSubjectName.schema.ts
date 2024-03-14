import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'

export const editCurrentUserStructureSubjectNameSchema = z.object({
  id: z.string().uuid(),
  name: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
})

export type EditCurrentUserStructureSubjectNameInput = z.infer<
  typeof editCurrentUserStructureSubjectNameSchema
>
