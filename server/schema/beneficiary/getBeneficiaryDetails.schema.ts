import { z } from 'zod'

export const getBeneficiaryDetailsSchema = z.object({
  id: z.string().uuid(),
  options: z
    .object({
      accommodation: z.boolean().optional()
    })
    .optional()
})

export type GetBeneficiaryDetailsInput = z.infer<
  typeof getBeneficiaryDetailsSchema
>
