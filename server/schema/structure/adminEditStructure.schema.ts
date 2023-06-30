import { DefaultFollowupType, StructureType } from '@prisma/client'
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
    ),
    type: z.nativeEnum(StructureType),
    inhabitantsNumber: z.string().nullish(),
    inseeCode: z.string().nullish(),
    siret: z.string().nullish()
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
