import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { beneficiaryFilterSchema } from '../filter.schema'

export const exportBeneficiariesSchema = z.object({
  orderBy: z.array(
    z.object({
      firstName: z.nativeEnum(Prisma.SortOrder).optional(),
      usualName: z.nativeEnum(Prisma.SortOrder).optional(),
      birthDate: z
        .object({
          sort: z.nativeEnum(Prisma.SortOrder),
          nulls: z.literal('last')
        })
        .optional()
    })
  ),
  filters: beneficiaryFilterSchema
})

export type ExportBeneficiariesInput = z.infer<typeof exportBeneficiariesSchema>
