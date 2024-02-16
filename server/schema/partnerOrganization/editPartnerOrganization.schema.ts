import { z } from 'zod'
import { addPartnerOrganizationSchema } from './addPartnerOrganization.schema'

export const editPartnerOrganizationSchema =
  addPartnerOrganizationSchema.extend({
    id: z.string().uuid()
  })

export type EditPartnerOrganizationInput = z.infer<
  typeof editPartnerOrganizationSchema
>
