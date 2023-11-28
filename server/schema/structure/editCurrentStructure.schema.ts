import { z } from 'zod'
import { DefaultFollowupType } from '@prisma/client'
import { editStructureSchema } from './editStructure.schema'

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
      val.legallyRequiredFollowupTypes.length ||
      val.legallyNotRequiredFollowupTypes.length,
    {
      message: 'Veuillez sélectionner au moins une aide légale ou facultative.',
      path: ['legallyRequiredFollowupTypes']
    }
  )
  .refine(
    val =>
      val.legallyRequiredFollowupTypes.length ||
      val.legallyNotRequiredFollowupTypes.length,
    {
      message: 'Veuillez sélectionner au moins une aide légale ou facultative.',
      path: ['legallyNotRequiredFollowupTypes']
    }
  )

export type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>
