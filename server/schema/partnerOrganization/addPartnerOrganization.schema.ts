import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredStringConstraint,
  siretConstraint,
  stringConstraint,
  stringOrEmpty
} from '..'

export const addPartnerOrganizationSchema = z.object({
  name: requiredStringConstraint,
  siret: siretConstraint,
  address: stringConstraint.nullish(),
  zipcode: stringConstraint.nullish(),
  city: stringConstraint.nullish(),
  email: emailOrEmpty(),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  workingHours: stringConstraint.nullish(),
  contacts: z
    .array(
      z.object({
        id: stringConstraint,
        name: requiredStringConstraint,
        email: stringConstraint.nullish(),
        phone: stringConstraint.nullish()
      })
    )
    .nullish()
})

export type AddPartnerOrganizationInput = z.infer<
  typeof addPartnerOrganizationSchema
>
