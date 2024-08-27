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
