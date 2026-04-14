import type { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportBeneficiariesSchema } from './exportBeneficiaries.schema'

export const getBeneficiariesSchema = exportBeneficiariesSchema
  .omit({ code: true })
  .extend(paginatedSchema.shape)

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
