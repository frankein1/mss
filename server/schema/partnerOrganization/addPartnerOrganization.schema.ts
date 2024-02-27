import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  siretConstraint,
  stringConstraint,
  stringOrEmpty
} from '..'

export const addPartnerOrganizationSchema = z.object({
  name: z.string(),
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
        id: stringConstraint.nullish(),
        name: stringConstraint,
        email: stringConstraint,
        phone: stringConstraint.nullish(),
        deleted: z.boolean()
      })
    )
    .nullish()
})

export type AddPartnerOrganizationInput = z.infer<
  typeof addPartnerOrganizationSchema
>
