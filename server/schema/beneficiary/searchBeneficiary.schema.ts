import { z } from 'zod'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const searchBeneficiarySchema = z.object({
  query: stringConstraint.max(50, maxStringLengthMessage(50)),
  excludedIds: z.array(z.string().uuid()).optional()
})

export type SearchBeneficiaryInput = z.infer<typeof searchBeneficiarySchema>
