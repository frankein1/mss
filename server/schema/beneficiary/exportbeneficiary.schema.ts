import { ArchiveReason } from '@prisma/client'
import { z } from 'zod/v4'

export const exportBeneficiarySchema = z.object({
  keepName: z.boolean().default(false),
  beneficiaryId: z.string().uuid(),
  reason: z.nativeEnum(ArchiveReason).nullish(),
  date: z.coerce.date().nullish().optional(),
  clarification: z.string().optional()
})

export type ExportBeneficiaryInput = z.infer<typeof exportBeneficiarySchema>
