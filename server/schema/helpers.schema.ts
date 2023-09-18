import { z } from 'zod'

export const paginatedSchema = z.object({
  page: z.number(),
  perPage: z.number()
})

export const optionalPaginatedSchema = z.object({
  page: z.number().nullish(),
  perPage: z.number().nullish()
})

export type PaginatedInput = z.infer<typeof paginatedSchema>
