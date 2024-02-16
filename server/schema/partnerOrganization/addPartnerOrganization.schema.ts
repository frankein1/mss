import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  siretConstraint,
  stringConstraint
} from '..'

export const addPartnerOrganizationSchema = z.object({
  name: z.string(),
  siret: siretConstraint,
  address: stringConstraint.nullable(),
  zipcode: stringConstraint.nullable(),
  city: stringConstraint.nullable(),
  email: emailOrEmpty(),
  phone1: phoneConstraint.nullable(),
  phone2: phoneConstraint.nullable(),
  workingHours: stringConstraint.nullable()
})

export type AddPartnerOrganizationInput = z.infer<
  typeof addPartnerOrganizationSchema
>
