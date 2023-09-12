import { z } from 'zod'
import { saveBeneficiaryGeneralInformationSchema } from '../'

export const saveToBeneficiarySchema = z.object({
  draftId: z.string().uuid().optional(),
  general: saveBeneficiaryGeneralInformationSchema.optional()
})

export type SaveToBeneficiaryInput = z.infer<typeof saveToBeneficiarySchema>
