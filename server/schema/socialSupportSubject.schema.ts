import { z } from 'zod'
import { DefaultSocialSupportSubject } from '@prisma/client'
import { socialSupportSubjectNameConstraint } from './socialSupportSubject/name.schema'

const createSocialSupportSubjectSchema = z.object({
  name: socialSupportSubjectNameConstraint,
  default: z.nativeEnum(DefaultSocialSupportSubject).nullish(),
  ownedByStructureId: z.string().uuid()
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
