import { DefaultFollowupType, StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validZipcode,
  validEmailMessage,
  requiredNativeEnum,
  wordConstraint,
  phoneConstraint
} from '~/utils/zod'

export const createStructureSchema = z.object({
  type: requiredNativeEnum(StructureType),
  name: wordConstraint().min(2, minStringLengthMessage(2)),
  zipcode: wordConstraint().min(5, validZipcode),
  city: wordConstraint().min(2, minStringLengthMessage(2)),
  address: wordConstraint().min(2, minStringLengthMessage(2)),
  phone: phoneConstraint,
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
