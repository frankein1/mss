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
export const limitPOWebsite = 500
export const limitPOWorkingHours = 1200

export const addCustomPartnerOrganizationSchema = z.object({
  dataSource: z.literal('Custom'),
  name: requiredLimitedStringConstraint(limitPOName),
  siret: siretConstraint,
  address: limitedStringConstraint(null, limitPOAddress).nullish(),
  zipcode: limitedStringConstraint(null, 20).nullish(), // some values are "Code postal inconnu"
  city: limitedStringConstraint().nullish(),
  email: emailOrEmpty(),
  phone1: stringOrEmpty(phoneConstraint),
  phone2: stringOrEmpty(phoneConstraint),
  website: limitedStringConstraint(null, limitPOWebsite).nullish(),
  workingHours: limitedStringConstraint(null, limitPOWorkingHours).nullish(),
  contacts: contactPartnerOrganizationSchema
})

export const addDataInclusionV1PartnerOrganizationSchema =
  addCustomPartnerOrganizationSchema.extend({
    dataSource: z.literal('DataInclusionV1'),
    dataInclusionIdV1: requiredStringConstraint,
    siret: siretConstraint.nullish(),
    phone1: limitedStringConstraint(null, 20).nullish()
  })

export const addPartnerOrganizationSchema = z.discriminatedUnion('dataSource', [
  addCustomPartnerOrganizationSchema,
  addDataInclusionV1PartnerOrganizationSchema
])

export type AddPartnerOrganizationInput = z.infer<
  typeof addPartnerOrganizationSchema
>
