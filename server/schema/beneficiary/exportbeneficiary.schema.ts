import { ArchiveReason } from '@prisma/client'
import { z } from 'zod/v4'

export const exportBeneficiarySchema = z.object({
  keepName: z.boolean().prefault(false),
  beneficiaryId: z.uuid(),
  reason: z.enum(ArchiveReason).nullish(),
  date: z.coerce.date().nullish().optional(),
  clarification: z.string().optional()
})

export type ExportBeneficiaryInput = z.infer<typeof exportBeneficiarySchema>
