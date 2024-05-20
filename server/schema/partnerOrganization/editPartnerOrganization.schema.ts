import { z } from 'zod'
import {
  addDataInclusionPartnerOrganizationSchema,
  addCustomPartnerOrganizationSchema
} from './addPartnerOrganization.schema'

export const editDataInclusionPartnerOrganizationSchema =
  addDataInclusionPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })

export const editCustomPartnerOrganizationSchema =
  addCustomPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })

export const editPartnerOrganizationSchema = z.union([
  editDataInclusionPartnerOrganizationSchema,
  editCustomPartnerOrganizationSchema
])

export type EditPartnerOrganizationInput = z.infer<
  typeof editPartnerOrganizationSchema
>
