import { z } from 'zod'
import { updateBeneficiaryDraftSchema } from './'

export const saveToBeneficiarySchema = updateBeneficiaryDraftSchema.extend({
  id: z.string().uuid().optional()
})

export type SaveToBeneficiaryInput = z.infer<typeof saveToBeneficiarySchema>
