import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { userAdminFilterSchema } from '~/server/schema'
import { stringConstraint, maxStringLengthMessage } from '~/utils/zod'

export const adminGetUsersSchema = z.object({
  search: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
  filters: userAdminFilterSchema,
  orderBy: z.array(
    z.object({
      lastAccess: z.nativeEnum(Prisma.SortOrder).optional()
    })
  )
})

export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>
