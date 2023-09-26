import { z } from 'zod'

export const paginatedSchema = z.object({
  page: z.number().int().gte(1),
  perPage: z.number().int().gte(5)
})

export const optionalPaginatedSchema = z.object({
  page: z.number().nullish(),
  perPage: z.number().nullish()
})

export type PaginatedInput = z.infer<typeof paginatedSchema>
