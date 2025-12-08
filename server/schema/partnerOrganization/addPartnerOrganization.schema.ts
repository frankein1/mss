import { z } from 'zod'
import {
  emailOrEmpty,
  phoneConstraint,
  requiredStringConstraint,
  siretConstraint,
  requiredLimitedStringConstraint,
  limitedStringConstraint,
  stringOrEmpty
} from '..'

const contactPartnerOrganizationSchema = z
  .array(
    z.object({
      id: limitedStringConstraint(),
      name: requiredLimitedStringConstraint(),
      email: limitedStringConstraint().nullish(),
      phone: limitedStringConstraint().nullish()
    })
  )
  .nullish()

export const limitPOName = 300
export const limitPOAddress = 100
export const limitPOWorkingHours = 1200

export const addCustomPartnerOrganizationSchema = z.object({
  name: requiredLimitedStringConstraint(limitPOName),
  siret: siretConstraint,
  address: limitedStringConstraint(null, limitPOAddress).nullish(),
  zipcode: limitedStringConstraint(null, 10).nullish(),
  city: limitedStringConstraint().nullish(),
  email: emailOrEmpty(),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  workingHours: limitedStringConstraint(null, limitPOWorkingHours).nullish(),
  contacts: contactPartnerOrganizationSchema
})

export const addDataInclusionPartnerOrganizationSchema =
  addCustomPartnerOrganizationSchema.extend({
    dataInclusionId: requiredStringConstraint,
    siret: siretConstraint.nullish(),
    phone1: limitedStringConstraint(null, 20).nullish()
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
