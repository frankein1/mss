import { DefaultFollowupType, StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validZipcode,
  validEmailMessage
} from '~/utils/zod'

export const createStructureSchema = z.object({
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
