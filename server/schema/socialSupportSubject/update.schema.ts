import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage, minStringLengthMessage } from '~/utils/zod'

export const updateSocialSupportSubjectSchema = z.object({
  id: z.string().uuid(),
  name: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2))
})

export type UpdateSocialSupportSubjectNameInput = z.infer<
  typeof updateSocialSupportSubjectSchema
>
