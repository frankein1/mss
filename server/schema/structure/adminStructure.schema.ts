import { StructureType } from '@prisma/client'
import { z } from 'zod'
import {
  requiredNativeEnum,
  stringConstraint,
  siretConstraint,
  stringOrEmpty,
  phoneConstraint
} from '../helpers.schema'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validZipcode,
  validEmailMessage
} from '~/utils/zod'

export const createStructureSchema = z.object({
  type: requiredNativeEnum(StructureType),
  inhabitantsNumber: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .nullish(),
  inseeCode: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
  siret: stringOrEmpty(siretConstraint),
  name: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  zipcode: stringConstraint
    .max(10, maxStringLengthMessage(10))
    .min(5, validZipcode),
  city: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  address: stringConstraint
    .max(100, maxStringLengthMessage(100))
    .min(2, minStringLengthMessage(2)),
  phone: phoneConstraint,
  email: z.string(errorMessages).email(validEmailMessage),
  dpoFirstName: stringConstraint
    .max(50, maxStringLengthMessage(50))
    .min(2, minStringLengthMessage(2)),
  dpoLastName: stringConstraint
    .min(2, minStringLengthMessage(2))
    .max(50, maxStringLengthMessage(50))
    .toUpperCase(),
  dpoEmail: z.string(errorMessages).email(validEmailMessage)
})

export type CreateStructureInput = z.infer<typeof createStructureSchema>

export const editStructureAdminInfoSchema = createStructureSchema.extend({
  id: z.string().uuid()
})

export type EditStructureAdminInfoInput = z.infer<
  typeof editStructureAdminInfoSchema
>

export const adminGetStructuresSchema = z
  .object({
    search: stringConstraint.max(50, maxStringLengthMessage(50)).nullish()
  })
  .optional()

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
