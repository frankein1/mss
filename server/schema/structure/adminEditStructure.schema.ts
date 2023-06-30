import { DefaultFollowupType } from '@prisma/client'
import { z } from 'zod'
import { editStructureSchema } from './editStructure.schema'

export const adminEditStructureSchema = editStructureSchema
  .omit({
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

export type AdminEditStructureInput = z.infer<typeof adminEditStructureSchema>
