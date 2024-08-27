import { z } from 'zod'
import { updateBeneficiaryGeneralInformationSchema } from './updateBeneficiary.schema'

export const createBeneficiarySchema = updateBeneficiaryGeneralInformationSchema
  .pick({
    status: true,
    referents: true,
    title: true,
    usualName: true,
    birthName: true,
    firstName: true,
    phone1: true,
    email: true,
    numeroPegase: true,
    street: true,
    zipcode: true,
    city: true,
    birthDate: true
  })
  .merge(
    z.object({
      draft: z.boolean().default(false)
    })
  )

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
