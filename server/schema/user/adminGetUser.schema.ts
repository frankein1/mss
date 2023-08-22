import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { userAdminFilterSchema } from '~/server/schema'

export const adminGetUsersSchema = z.object({
  search: z.string().nullish(),
  filters: userAdminFilterSchema,
  orderBy: z.array(
    z.object({
      lastAccess: z.nativeEnum(Prisma.SortOrder).optional()
    })
  )
})

export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>
