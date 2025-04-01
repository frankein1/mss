import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { fileInstructionFilterSchema } from './filter.schema'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportFileInstructionsSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  orderBy: z.object({
    socialSupport: z
      .object({
        date: z.nativeEnum(Prisma.SortOrder).optional(),
        beneficiary: z
          .object({
            usualName: z.nativeEnum(Prisma.SortOrder).optional()
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
