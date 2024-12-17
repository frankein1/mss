import { z } from 'zod'

export const exportBeneficiarySchema = z.object({
  beneficiaryId: z.string().uuid(),
  clarification: z.string().optional(),
  reason: z.string().optional(),
  date: z.coerce.date().nullish().optional()
})

export type ExportBeneficiaryInput = z.infer<typeof exportBeneficiarySchema>
