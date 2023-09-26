import { z } from 'zod'

export const paginatedSchema = z.object({
  page: z.number().int().gte(1),
  perPage: z.number().int().gte(5)
})

export type PaginatedInput = z.infer<typeof paginatedSchema>
