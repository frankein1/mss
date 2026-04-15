import { Prisma } from '@prisma/client'
import { z } from 'zod/v4'
import { beneficiaryFilterSchema } from '../filter.schema'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportBeneficiariesSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  orderBy: z.object({
    firstName: z.nativeEnum(Prisma.SortOrder).optional(),
    usualName: z.nativeEnum(Prisma.SortOrder).optional(),
    birthDate: z
      .object({
        sort: z.nativeEnum(Prisma.SortOrder),
        nulls: z.literal('last')
      })
      .optional()
  }),
  filters: beneficiaryFilterSchema
})

export type ExportBeneficiariesInput = z.infer<typeof exportBeneficiariesSchema>
