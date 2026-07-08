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
    birthDate: true,
    phone1: true,
    email: true,
    numeroPegase: true,
    street: true,
    zipcode: true,
    city: true,
    department: true,
    region: true,
    qpv: true,
    district: true
  })

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>
