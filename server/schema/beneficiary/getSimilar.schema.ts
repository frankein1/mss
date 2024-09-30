import { z } from 'zod'
import { dateOrEmpty } from '../helpers.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
import { beneficiaryLastNameOrEmptySchema } from './beneficiaryLastName.schema'

export const getSimilarBeneficiarySchema = z
  .object({
    usualName: beneficiaryLastNameOrEmptySchema,
    birthName: beneficiaryLastNameOrEmptySchema,
    firstName: beneficiaryFirstNameOrEmptySchema,
    birthDate: dateOrEmpty
  })
  .refine(
    ({ usualName, birthName, firstName, birthDate }) =>
      usualName || birthName || firstName || birthDate
  )

export type GetSimilarBeneficiaryInput = z.infer<
  typeof getSimilarBeneficiarySchema
>
