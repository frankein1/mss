import { z } from 'zod/v4'
import { DefaultSocialSupportSubject } from '@prisma/client'
import { stringConstraint } from './helpers.schema'
import { minStringLengthMessage, maxStringLengthMessage } from '~/utils/zod'

const createSocialSupportSubjectSchema = z.object({
  name: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .min(2, minStringLengthMessage(2)),
  default: z.enum(DefaultSocialSupportSubject).nullish(),
  ownedByStructureId: z.uuid()
})

const createCustomSocialSupportSubjectSchema =
  createSocialSupportSubjectSchema.pick({
    name: true
  })

type CreateSocialSupportSubjectInput = z.infer<
  typeof createSocialSupportSubjectSchema
>
type CreateCustomSocialSupportSubjectInput = z.infer<
  typeof createCustomSocialSupportSubjectSchema
>

export {
  createSocialSupportSubjectSchema,
  createCustomSocialSupportSubjectSchema
}

export type {
  CreateSocialSupportSubjectInput,
  CreateCustomSocialSupportSubjectInput
}
