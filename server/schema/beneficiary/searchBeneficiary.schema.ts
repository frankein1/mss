import { z } from 'zod'

export const searchBeneficiarySchema = z.object({
  query: z.string(),
  excludedIds: z.array(z.string().uuid()).optional()
})

export type SearchBeneficiaryInput = z.infer<typeof searchBeneficiarySchema>
