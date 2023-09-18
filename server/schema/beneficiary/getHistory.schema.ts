import { z } from 'zod'
import { beneficiaryHistoryFilterSchema } from '../filter.schema'

export const getHistorySchema = z.object({
  beneficiaryId: z.string().uuid(),
  filters: beneficiaryHistoryFilterSchema
})

export type GetHistoryInput = z.infer<typeof getHistorySchema>
