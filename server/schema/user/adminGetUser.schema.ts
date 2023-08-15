import { z } from 'zod'
import { userAdminFilterSchema } from '~/server/schema'

export const adminGetUsersSchema = z.object({
  search: z.string().nullish(),
  filters: userAdminFilterSchema
})

export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>
