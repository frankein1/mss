import { z } from 'zod'

export const adminGetStructuresSchema = z.object({
  search: z.string().nullish()
})

export type AdminGetStructuresInput = z.infer<typeof adminGetStructuresSchema>
