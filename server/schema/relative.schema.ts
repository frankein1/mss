import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'
import { beneficiaryLastNameSchema } from './beneficiary/beneficiaryLastName.schema'
import {
  beneficiaryFirstNameOrEmptySchema,
  beneficiaryFirstNameSchema
} from './beneficiary/beneficiaryFirstName.schema'
import {
  requiredNativeEnum,
  withEmptyValueOptionalNativeEnum,
  phoneConstraint,
  stringConstraint,
  emailOrEmpty,
  stringOrEmpty,
  dateOrEmpty,
  openText
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
  additionalInformation: openText(200).nullish()
})

export type CreateOrUpdateEntourageInput = z.infer<
  typeof createOrUpdateEntourageSchema
>

export const createOrUpdateTaxHouseholdSchema = createOrUpdateEntourageSchema
  .extend({
    birthDate: dateOrEmpty
  })
  .omit({ city: true })

export type CreateOrUpdateTaxHouseholdInput = z.infer<
  typeof createOrUpdateTaxHouseholdSchema
>

export const createHouseholdMemberSchema = z.object({
  lastName: beneficiaryLastNameSchema,
  firstName: beneficiaryFirstNameSchema,
  relationship: requiredNativeEnum(RelativeRelationship),
  beneficiaryId: z.string().uuid(),
  budgetId: z.string().uuid()
})

export type CreateHouseholdMemberInput = z.infer<
  typeof createHouseholdMemberSchema
>
