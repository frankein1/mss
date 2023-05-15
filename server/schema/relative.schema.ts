import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'

export const createOrUpdateEntourageSchema = z.object({
  id: z.string().uuid().nonempty(),
  lastName: z.string().nullish(),
  firstName: z.string().nullish(),
  relationship: z.nativeEnum(RelativeRelationship).nullish(),
  city: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  caregiver: z.boolean().default(false),
  additionalInformation: z.string().nullish()
})

export type CreateOrUpdateEntourageInput = z.infer<
  typeof createOrUpdateEntourageSchema
>

export const createOrUpdateTaxHouseholdSchema =
  createOrUpdateEntourageSchema.extend({
    beneficiary: z
      .object({
        id: z.string().uuid().nonempty(),
        usualName: z.string().nullable(),
        firstName: z.string().nullable(),
        birthName: z.string().nullable()
      })
      .nullish()
  })

export type CreateOrUpdateTaxHouseholdInput = z.infer<
  typeof createOrUpdateTaxHouseholdSchema
>
