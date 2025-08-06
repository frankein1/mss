import { z } from 'zod/v4'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage, minStringLengthMessage } from '~/utils/zod'

export const updateSocialSupportSubjectSchema = z.object({
  id: z.uuid(),
  name: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2))
})

export type UpdateSocialSupportSubjectNameInput = z.infer<
  typeof updateSocialSupportSubjectSchema
>
