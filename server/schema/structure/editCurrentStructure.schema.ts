import { DefaultFollowupType } from '@prisma/client'
import { z } from 'zod'
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
      val.legallyRequiredFollowupTypes.length &&
      val.legallyNotRequiredFollowupTypes.length,
    {
      message: "Veuillez sélectionner au moins un type d'accompagnement."
    }
  )

export type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>
