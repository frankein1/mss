import { BeneficiaryStatus } from '@prisma/client'
import { z } from 'zod'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredNativeEnum,
  numeroPegaseContraint,
  stringOrEmpty,
  dateSchema
} from '~/utils/zod'

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
  birthDate: dateSchema.nullish(),
  phone1: stringOrEmpty(phoneConstraint),
  email: emailOrEmpty(),
  numeroPegase: stringOrEmpty(numeroPegaseContraint)
})

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
