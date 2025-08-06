import { z } from 'zod/v4'

export const getWorkshopSchema = z.object({
  id: z.uuid(),
  includeAttendees: z.boolean().prefault(false)
})

export type GetWorkshopInput = z.infer<typeof getWorkshopSchema>
