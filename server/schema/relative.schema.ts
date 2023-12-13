import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'
import { beneficiaryLastNameSchema } from './beneficiary/beneficiaryLastName.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiary/beneficiaryFirstName.schema'
import {
  withEmptyValueOptionalNativeEnum,
  phoneConstraint,
  stringConstraint,
  emailOrEmpty,
  stringOrEmpty,
  dateOrEmpty
} from './helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const createOrUpdateEntourageSchema = z.object({
  id: z.string().uuid(),
  lastName: stringOrEmpty(beneficiaryLastNameSchema),
  firstName: beneficiaryFirstNameOrEmptySchema,
  relationship: withEmptyValueOptionalNativeEnum(RelativeRelationship),
  city: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  email: emailOrEmpty(),
  phone: stringOrEmpty(phoneConstraint),
  caregiver: z.boolean().default(false),
  additionalInformation: stringConstraint
    .max(200, maxStringLengthMessage(200))
    .nullish()
})

export type CreateOrUpdateEntourageInput = z.infer<
  typeof createOrUpdateEntourageSchema
>

export const createOrUpdateTaxHouseholdSchema = createOrUpdateEntourageSchema
  .extend({
    linkedBeneficiary: z
      .object({
        id: z.string().uuid(),
        usualName: stringOrEmpty(beneficiaryLastNameSchema),
        firstName: beneficiaryFirstNameOrEmptySchema,
        birthName: stringOrEmpty(beneficiaryLastNameSchema)
      })
      .nullish(),
    birthDate: dateOrEmpty
  })
  .omit({ city: true })

export type CreateOrUpdateTaxHouseholdInput = z.infer<
  typeof createOrUpdateTaxHouseholdSchema
>
