import { DefaultFollowupType, StructureType } from '@prisma/client'
import { z } from 'zod'
import { editStructureSchema } from './editStructure.schema'
import {
  requiredNativeEnum,
  stringConstraint,
  siretConstraint,
  maxStringLengthMessage
} from '~/utils/zod'

export const adminEditStructureSchemaBase = editStructureSchema
  .omit({
    followupTypes: true
  })
  .extend({
    type: requiredNativeEnum(StructureType),
    inhabitantsNumber: stringConstraint
      .max(50, maxStringLengthMessage(50))
      .nullish(),
    inseeCode: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
    siret: siretConstraint.nullish()
  })

export const adminEditStructureSchema = adminEditStructureSchemaBase
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
