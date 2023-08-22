import { BeneficiaryStatus } from '@prisma/client'
import { z } from 'zod'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'
import { beneficiaryFirstNameSchema } from './beneficiaryFirstName.schema'
import { emailOrEmpty, errorMessages, requiredNativeEnum } from '~/utils/zod'

export const createBeneficiarySchema = z.object({
  status: requiredNativeEnum(BeneficiaryStatus),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent'
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  usualName: beneficiaryLastNameSchema,
  birthName: beneficiaryLastNameSchema,
  firstName: beneficiaryFirstNameSchema,
  birthDate: z.coerce.date(errorMessages).nullish(),
  phone1: z.string().nullish(),
  email: emailOrEmpty(),
  numeroPegase: z.string().nullish()
})

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
