import { z } from 'zod'
import {
  addDataInclusionPartnerOrganizationSchema,
  addCustomPartnerOrganizationSchema
} from './addPartnerOrganization.schema'

export const editPartnerOrganizationSchema = z.union([
  addDataInclusionPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  }),
  addCustomPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })
])

export type EditPartnerOrganizationInput = z.infer<
  typeof editPartnerOrganizationSchema
>
