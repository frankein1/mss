import { z } from 'zod'
import { createWorkshopSchema } from './createWorkshop.schema'

export const updateWorkshopSchema = createWorkshopSchema
  .extend({
    id: z.string().uuid()
  })
  .omit({
    name: true
  })

export type UpdateWorkShopInput = z.infer<typeof updateWorkshopSchema>
