import { Prisma } from '@prisma/client'
import { z } from 'zod/v4'
import { followupFilterSchema } from '../filter.schema'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportFollowupsSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
  orderBy: z.object({
    socialSupport: z
      .object({
        date: z.enum(Prisma.SortOrder).optional(),
        dueDate: z.enum(Prisma.SortOrder).optional(),
        beneficiary: z
          .object({
            usualName: z.enum(Prisma.SortOrder).optional()
          })
          .optional()
      })
      .optional()
  }),
  filters: followupFilterSchema
})

export type ExportFollowupsInput = z.infer<typeof exportFollowupsSchema>
