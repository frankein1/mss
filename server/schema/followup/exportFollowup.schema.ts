import { Prisma } from '~/prisma/generated/browser'
import { z } from 'zod'
import { followupFilterSchema } from '../filter.schema'
import { VALIDATION_CODE_LENGTH } from '~/server/utils/constants'

export const exportFollowupsSchema = z.object({
  code: z.string().length(VALIDATION_CODE_LENGTH),
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
