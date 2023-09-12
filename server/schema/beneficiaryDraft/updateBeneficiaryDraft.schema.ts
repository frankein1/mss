import { z } from 'zod'
import { saveBeneficiaryGeneralInformationSchema } from '../'

export const updateBeneficiaryDraftSchema = z.object({
  id: z.string().uuid(),
  general: saveBeneficiaryGeneralInformationSchema.optional()
})

export type UpdateBeneficiaryDraftInput = z.infer<
  typeof updateBeneficiaryDraftSchema
>
