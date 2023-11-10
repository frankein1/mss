import { DefaultFollowupType } from '@prisma/client'
import { z } from 'zod'
import { editStructureSchema } from './editStructure.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const editCurrentUserStructureSchema = editStructureSchema
  .omit({
    structureId: true,
    followupTypes: true
  })
  .extend({
    legallyRequiredFollowupTypes: z.array(z.nativeEnum(DefaultFollowupType)),
    legallyNotRequiredFollowupTypes: z.array(
      z.union([
        z.string().uuid(),
        z.nativeEnum(DefaultFollowupType),
        z.string()
      ])
    )
  })
  .refine(
    val =>
      val.legallyRequiredFollowupTypes.length &&
      val.legallyNotRequiredFollowupTypes.length,
    { message: requiredErrorMessage }
  )

export type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>
