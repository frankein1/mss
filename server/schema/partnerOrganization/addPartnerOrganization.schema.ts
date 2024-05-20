import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredStringConstraint,
  siretConstraint,
  stringConstraint,
  stringOrEmpty
} from '..'

const contactPartnerOrganizationSchema = z
  .array(
    z.object({
      id: stringConstraint,
      name: requiredStringConstraint,
      email: stringConstraint.nullish(),
      phone: stringConstraint.nullish()
    })
  )
  .nullish()

export const addCustomPartnerOrganizationSchema = z.object({
  name: requiredStringConstraint,
  siret: siretConstraint,
  address: stringConstraint.nullish(),
  zipcode: stringConstraint.nullish(),
  city: stringConstraint.nullish(),
  email: emailOrEmpty(),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  workingHours: stringConstraint.nullish(),
  contacts: contactPartnerOrganizationSchema
})

export type AddCustomPartnerOrganizationInput = z.infer<
  typeof addCustomPartnerOrganizationSchema
>

export const addDataInclusionPartnerOrganizationSchema =
  addCustomPartnerOrganizationSchema.extend({
    dataInclusionId: requiredStringConstraint,
    siret: siretConstraint.nullish()
  })

export const addPartnerOrganizationSchema = z.union([
  addDataInclusionPartnerOrganizationSchema,
  addCustomPartnerOrganizationSchema
])

export type AddPartnerOrganizationInput = z.infer<
  typeof addPartnerOrganizationSchema
>

/** Server types */
export const addDataInclusionPartnerOrganizationServerSchema = z.object({
  dataInclusionId: requiredStringConstraint,
  contacts: contactPartnerOrganizationSchema
})

export type AddDataInclusionPartnerOrganizationServerInput = z.infer<
  typeof addDataInclusionPartnerOrganizationServerSchema
>

export const addPartnerOrganizationServerSchema = z.union([
  addDataInclusionPartnerOrganizationServerSchema,
  addCustomPartnerOrganizationSchema
])

export type AddPartnerOrganizationServerInput = z.infer<
  typeof addPartnerOrganizationServerSchema
>
