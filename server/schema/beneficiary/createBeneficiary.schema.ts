import type { z } from 'zod'
import { updateBeneficiaryGeneralInformationSchema } from './updateBeneficiary.schema'

export const createBeneficiarySchema =
  updateBeneficiaryGeneralInformationSchema.pick({
    status: true,
    referents: true,
    gender: true,
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
    department: true,
    region: true,
    birthDate: true
  })

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
