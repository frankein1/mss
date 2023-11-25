import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { emailAdminFilterSchema } from '../filter.schema'

export const adminGetEmailsSchema = z.object({
  filters: emailAdminFilterSchema,
  orderBy: z.array(
    z.object({
      sentDate: z.nativeEnum(Prisma.SortOrder).optional()
    })
  )
})

export type AdminGetEmailsInput = z.infer<typeof adminGetEmailsSchema>
