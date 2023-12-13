import { BeneficiaryStatus } from '@prisma/client'
import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredNativeEnum,
  numeroPegaseContraint,
  stringOrEmpty,
  dateOrEmpty
} from '../helpers.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
import { requiredErrorMessage } from '~/utils/zod'

export const createBeneficiarySchema = z.object({
  status: requiredNativeEnum(BeneficiaryStatus),
  referents: z
    .array(z.string().uuid(), {
      required_error: requiredErrorMessage
    })
    .min(1, requiredErrorMessage),
  usualName: stringOrEmpty(beneficiaryLastNameSchema),
  birthName: stringOrEmpty(beneficiaryLastNameSchema),
  firstName: beneficiaryFirstNameOrEmptySchema,
  birthDate: dateOrEmpty,
  phone1: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  numeroPegase: stringOrEmpty(numeroPegaseContraint)
})

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
