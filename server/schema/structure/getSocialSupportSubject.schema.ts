// TODO move to socialSupportSubject
import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'

export const getSocialSupportSubjectSchema = z.object({
  name: stringConstraint,
  structureId: z.string().uuid()
})

export type GetSocialSupportSubjectInput = z.infer<
  typeof getSocialSupportSubjectSchema
>
