import { z } from 'zod'
import { socialSupportSubjectNameConstraint } from './name.schema'

export const updateSocialSupportSubjectSchema = z.object({
  id: z.string().uuid(),
  name: socialSupportSubjectNameConstraint
})

export type UpdateSocialSupportSubjectNameInput = z.infer<
  typeof updateSocialSupportSubjectSchema
>
