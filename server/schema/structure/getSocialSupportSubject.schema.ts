// TODO move to socialSupportSubject
import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'

export const getSocialSupportSubjectSchema = z.object({
  name: stringConstraint
})

export type GetSocialSupportSubjectInput = z.infer<
  typeof getSocialSupportSubjectSchema
>
