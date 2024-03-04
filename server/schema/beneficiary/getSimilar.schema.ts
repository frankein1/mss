import { z } from 'zod'
import { dateOrEmpty } from '../helpers.schema'
import { beneficiaryFirstNameOrEmptySchema } from './beneficiaryFirstName.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'

export const getSimilarBeneficiarySchema = z
  .object({
    usualName: beneficiaryLastNameSchema,
    firstName: beneficiaryFirstNameOrEmptySchema,
    birthDate: dateOrEmpty
  })
  .refine(
    ({ usualName, firstName, birthDate }) =>
      usualName && (firstName || birthDate)
  )

export type GetSimilarBeneficiaryInput = z.infer<
  typeof getSimilarBeneficiarySchema
>
