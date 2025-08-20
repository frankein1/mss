import type { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportBeneficiariesSchema } from './exportBeneficiaries.schema'

export const getBeneficiariesSchema = exportBeneficiariesSchema
  .omit({ code: true })
  .merge(paginatedSchema)

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
