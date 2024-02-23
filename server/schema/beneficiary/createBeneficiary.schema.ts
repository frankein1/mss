import { z } from 'zod'
import { saveBeneficiaryGeneralInformationSchema } from './saveBeneficiary.schema'

export const createBeneficiarySchema =
  saveBeneficiaryGeneralInformationSchema.pick({
    status: true,
    referents: true,
    usualName: true,
    birthName: true,
    firstName: true,
    phone1: true,
    email: true,
    numeroPegase: true,
    street: true,
    zipcode: true,
    city: true
  })

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
