import { z } from 'zod/v4'
import { Prisma } from '@prisma/client'
import { fileInstructionFilterSchema } from './filter.schema'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportFileInstructionsSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  orderBy: z.object({
    socialSupport: z
      .object({
        date: z.enum(Prisma.SortOrder).optional(),
        beneficiary: z
          .object({
            usualName: z.enum(Prisma.SortOrder).optional()
          })
          .optional()
      })
      .optional()
  }),
  filters: fileInstructionFilterSchema
})

export type ExportFileInstructionsInput = z.infer<
  typeof exportFileInstructionsSchema
>
