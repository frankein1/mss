import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { followupFilterSchema } from '../filter.schema'

export const exportFollowupsSchema = z.object({
  orderBy: z.object({
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
  filters: followupFilterSchema
})

export type ExportFollowupsInput = z.infer<typeof exportFollowupsSchema>
