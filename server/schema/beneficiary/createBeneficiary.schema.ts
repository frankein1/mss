import { BeneficiaryStatus } from '@prisma/client'
import { z } from 'zod'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import { beneficiaryFirstNameSchema } from './beneficiaryFirstName.schema'
import {
  emailOrEmpty,
  errorMessages,
  phoneConstraint,
  requiredNativeEnum,
  numeroPegaseContraint
} from '~/utils/zod'

export const createBeneficiarySchema = z.object({
  status: requiredNativeEnum(BeneficiaryStatus),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  usualName: beneficiaryLastNameSchema.nullish(),
  birthName: beneficiaryLastNameSchema.nullish(),
  firstName: beneficiaryFirstNameSchema.nullish(),
  birthDate: z.coerce.date(errorMessages).nullish(),
  phone1: phoneConstraint.nullish(),
  email: emailOrEmpty(),
  numeroPegase: numeroPegaseContraint.nullish()
})

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
