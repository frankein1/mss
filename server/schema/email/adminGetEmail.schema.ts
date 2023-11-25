import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { emailAdminFilterSchema } from '../filter.schema'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminGetEmailsSchema = z.object({
  search: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
  filters: emailAdminFilterSchema,
  orderBy: z.array(
    z.object({
      sentDate: z.nativeEnum(Prisma.SortOrder).optional()
    })
  )
})

export type AdminGetEmailsInput = z.infer<typeof adminGetEmailsSchema>
