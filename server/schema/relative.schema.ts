import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'
import { beneficiaryLastNameSchema } from './beneficiary/beneficiaryLastName.schema'
import { beneficiaryFirstNameSchema } from './beneficiary/beneficiaryFirstName.schema'
import {
  withEmptyValueOptionalNativeEnum,
  phoneConstraint,
  wordConstraint,
  emailOrEmpty
} from '~/utils/zod'

export const createOrUpdateEntourageSchema = z.object({
  id: z.string().uuid().nonempty(),
  lastName: beneficiaryLastNameSchema.nullish(),
  firstName: beneficiaryFirstNameSchema.nullish(),
  relationship: withEmptyValueOptionalNativeEnum(RelativeRelationship),
  city: wordConstraint().nullish(),
  email: emailOrEmpty(),
  phone: phoneConstraint.nullish(),
  caregiver: z.boolean().default(false),
  additionalInformation: wordConstraint().nullish()
})

export type CreateOrUpdateEntourageInput = z.infer<
  typeof createOrUpdateEntourageSchema
>

export const createOrUpdateTaxHouseholdSchema =
  createOrUpdateEntourageSchema.extend({
    linkedBeneficiary: z
      .object({
        id: z.string().uuid().nonempty(),
        usualName: beneficiaryLastNameSchema.nullable(),
        firstName: beneficiaryFirstNameSchema.nullable(),
        birthName: beneficiaryLastNameSchema.nullable()
      })
      .nullish()
  })

export type CreateOrUpdateTaxHouseholdInput = z.infer<
  typeof createOrUpdateTaxHouseholdSchema
>
