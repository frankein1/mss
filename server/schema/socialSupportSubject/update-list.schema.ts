import { z } from 'zod'
import { socialSupportSubjectNameConstraint } from './name.schema'

export const updateSocialSupportSubjectsSchema = z.object({
  selected: z.array(
    z.object({
      id: z.string().uuid(),
      active: z.boolean(),
      name: z.string()
    })
  ),
  customs: z.array(
    z.object({
      name: socialSupportSubjectNameConstraint
    })
  )
})

export type UpdateSocialSupportSubjectsInput = z.infer<
  typeof updateSocialSupportSubjectsSchema
>

export const updateAdminStructureSubjectsSchema =
  updateSocialSupportSubjectsSchema.extend({
    structureId: z.string().uuid()
  })

export type UpdateAdminStructureSubjectsInput = z.infer<
  typeof updateAdminStructureSubjectsSchema
>
