import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { beneficiaryFilterSchema } from '../filter.schema'

export const exportBeneficiariesSchema = z.object({
  orderBy: z.array(
    z.object({
      firstName: z.nativeEnum(Prisma.SortOrder).optional(),
      usualName: z.nativeEnum(Prisma.SortOrder).optional()
    })
  ),
  filters: beneficiaryFilterSchema
})

export type ExportBeneficiariesInput = z.infer<typeof exportBeneficiariesSchema>
