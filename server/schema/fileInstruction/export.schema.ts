import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { fileInstructionFilterSchema } from './filter.schema'

export const exportFileInstructionsSchema = z.object({
  orderBy: z.object({
    instructorOrganization: z
      .object({
        name: z.nativeEnum(Prisma.SortOrder).optional()
      })
      .optional(),
    socialSupport: z
      .object({
        date: z.nativeEnum(Prisma.SortOrder).optional(),
        dueDate: z.nativeEnum(Prisma.SortOrder).optional(),
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
