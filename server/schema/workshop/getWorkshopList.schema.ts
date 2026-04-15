import { z } from 'zod/v4'
import { workshopFilterSchema } from '../filter.schema'

export const getWorkshopListSchema = z.object({
  filter: workshopFilterSchema,
  perPage: z.number(),
  page: z.number()
})

export type GetWorkshopListInput = z.infer<typeof getWorkshopListSchema>
