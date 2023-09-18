import { z } from 'zod'
import { wordConstraint } from '~/utils/zod'

export const searchBeneficiarySchema = z.object({
  query: wordConstraint(),
  excludedIds: z.array(z.string().uuid()).optional()
})

export type SearchBeneficiaryInput = z.infer<typeof searchBeneficiarySchema>
