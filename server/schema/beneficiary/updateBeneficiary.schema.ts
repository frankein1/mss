import { z } from 'zod'
import { saveBeneficiarySchema } from './saveBeneficiary.schema'

export const updateBeneficiarySchema = saveBeneficiarySchema.extend({
  id: z.string().uuid(),
  structureId: z.string().uuid()
})

export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>
