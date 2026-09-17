import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { fileInstructionFilterSchema } from './filter.schema'
import { validationCodeConstraint } from '../helpers.schema'

export const exportFileInstructionsSchema = z.object({
  code: validationCodeConstraint,
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
