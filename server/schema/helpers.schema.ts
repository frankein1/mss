import { z } from 'zod'

export const paginatedSchema = z.object({
  page: z.number(),
  perPage: z.number()
})

export type PaginatedInput = z.infer<typeof paginatedSchema>
