import { z } from 'zod'
import {
  addDataInclusionV1PartnerOrganizationSchema,
  addCustomPartnerOrganizationSchema
} from './addPartnerOrganization.schema'

export const editCustomPartnerOrganizationSchema =
  addCustomPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })

export const editDataInclusionV1PartnerOrganizationSchema =
  addDataInclusionV1PartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })

export const editPartnerOrganizationSchema = z.discriminatedUnion(
  'dataSource',
  [
    editCustomPartnerOrganizationSchema,
    editDataInclusionV1PartnerOrganizationSchema
  ]
)

export type EditPartnerOrganizationInput = z.infer<
  typeof editPartnerOrganizationSchema
>
