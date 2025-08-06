import { Prisma } from '@prisma/client'
import { z } from 'zod/v4'
import { emailAdminFilterSchema } from '../filter.schema'
import { paginatedSchema, stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminGetEmailsSchema = z
  .object({
    search: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
    filters: emailAdminFilterSchema,
    orderBy: z.object({
      sentDate: z.enum(Prisma.SortOrder).optional()
    })
  })
  .extend(paginatedSchema.shape)

export type AdminGetEmailsInput = z.infer<typeof adminGetEmailsSchema>
