import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage, minStringLengthMessage } from '~/utils/zod'

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
      name: stringConstraint
        .max(50, maxStringLengthMessage(50))
        .min(2, minStringLengthMessage(2))
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
