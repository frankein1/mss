import { z } from 'zod'
import { userAdminFilterSchema } from '../filter.schema'
import { stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const adminGetUsersSchema = z.object({
  search: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
  filters: userAdminFilterSchema.optional()
})

export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>
