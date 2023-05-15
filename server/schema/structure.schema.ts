import { StructureType, DefaultFollowupType } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  validZipcode
} from '~/utils/zod'

const createStructureSchema = z.object({
  type: z.nativeEnum(StructureType),
  name: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  zipcode: z.string(errorMessages).min(5, validZipcode),
  city: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  address: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  phone: z.string(errorMessages).min(10, minStringLengthMessage(10)),
  email: z.string(errorMessages).email(validEmailMessage),
  followupTypes: z
    .array(
      z.union([
        z.string().uuid(),
        z.nativeEnum(DefaultFollowupType),
        z.string()
      ])
    )
    .min(1, "Veuillez sélectionner au moins un type d'accompagnement.")
})

const editStructureSchema = createStructureSchema.omit({ type: true }).extend({
  structureId: z.string().uuid()
})

const editCurrentUserStructureSchema = editStructureSchema
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

// TODO
// type CreateStructureInput = z.infer<typeof createStructureSchema>
// type EditStructureInput = z.infer<typeof editStructureSchema>
type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>

export { editCurrentUserStructureSchema }

export type { EditCurrentUserStructureInput }
