import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportBeneficiariesSchema } from './exportBeneficiaries.schema'

export const getBeneficiariesSchema =
  exportBeneficiariesSchema.merge(paginatedSchema)

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
