import { z } from 'zod/v4'

export const getWorkshopSchema = z.object({
  id: z.string().uuid(),
  includeAttendees: z.boolean().default(false)
})

export type GetWorkshopInput = z.infer<typeof getWorkshopSchema>
