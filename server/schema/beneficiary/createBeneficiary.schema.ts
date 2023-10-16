import { BeneficiaryStatus } from '@prisma/client'
import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredNativeEnum,
  numeroPegaseContraint,
  stringOrEmpty
} from '../helpers.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'

export const createBeneficiarySchema = z.object({
  status: requiredNativeEnum(BeneficiaryStatus),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  usualName: stringOrEmpty(beneficiaryLastNameSchema),
  birthName: stringOrEmpty(beneficiaryLastNameSchema),
  firstName: beneficiaryFirstNameOrEmptySchema,
  birthDate: z.coerce.date().nullish(),
  phone1: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  numeroPegase: stringOrEmpty(numeroPegaseContraint)
})

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
