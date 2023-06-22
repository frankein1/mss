import { z } from 'zod'

export const adminGetUsersSchema = z.object({
  search: z.string().nullish()
})

export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>
