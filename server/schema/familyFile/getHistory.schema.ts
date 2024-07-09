import { z } from 'zod'
import { familyFileHistoryFilterSchema } from '../filter.schema'

export const getHistorySchema = z.object({
  familyFileId: z.string().uuid(),
  filters: familyFileHistoryFilterSchema
})

export type GetHistoryInput = z.infer<typeof getHistorySchema>
