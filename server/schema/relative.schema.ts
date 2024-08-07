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
  openText,
  dateOrEmpty
} from './helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const createOrUpdateEntourageSchema = z.object({
  id: z.string().uuid(),
  lastName: stringOrEmpty(beneficiaryLastNameSchema),
  firstName: beneficiaryFirstNameOrEmptySchema,
  birthDate: dateOrEmpty,
  relationship: withEmptyValueOptionalNativeEnum(RelativeRelationship),
  city: stringConstraint.max(100, maxStringLengthMessage(100)).nullish(),
  email: emailOrEmpty(),
  phone: stringOrEmpty(phoneConstraint),
  caregiver: z.boolean().default(false),
  hosted: z.boolean().default(false),
  additionalInformation: openText(200).nullish()
})

export type CreateOrUpdateEntourageInput = z.infer<
  typeof createOrUpdateEntourageSchema
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
