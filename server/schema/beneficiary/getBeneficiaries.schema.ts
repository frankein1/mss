import { z } from 'zod'
import { paginatedSchema } from '../helpers.schema'
import { exportBeneficiariesSchema } from './exportBeneficiaries.schema'

export const getBeneficiariesSchema = exportBeneficiariesSchema
  .omit({ code: true })
  .merge(paginatedSchema)
  .extend({ referents: z.boolean().optional() })

export type GetBeneficiariesInput = z.infer<typeof getBeneficiariesSchema>
