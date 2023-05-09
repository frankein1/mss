import { StructureType, DefaultFollowupType } from '@prisma/client'
import { z } from 'zod'
import { errorMessages } from '~/utils/zod'

const createStructureSchema = z.object({
  type: z.nativeEnum(StructureType),
  name: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  zipcode: z.string(errorMessages).min(5, errorMessages.invalid_type_error),
  city: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  address: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  phone: z.string(errorMessages).min(10, errorMessages.invalid_type_error),
  email: z.string(errorMessages).email(errorMessages.invalid_type_error),
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

const editCurrentUserStructureSchema = editStructureSchema.omit({
  structureId: true
})

// type CreateStructureInput = z.infer<typeof createStructureSchema>
// type EditStructureInput = z.infer<typeof editStructureSchema>
type EditCurrentUserStructureInput = z.infer<
  typeof editCurrentUserStructureSchema
>

export { editCurrentUserStructureSchema }

export type { EditCurrentUserStructureInput }
