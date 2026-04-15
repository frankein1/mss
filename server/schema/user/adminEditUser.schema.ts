import { z } from 'zod/v4'
import { adminCreateUserSchema } from './adminCreateUser.schema'

const adminEditUserSchema = adminCreateUserSchema.extend({
  id: z.string().uuid()
})

type AdminEditUserInput = z.infer<typeof adminEditUserSchema>

export { adminEditUserSchema }

export type { AdminEditUserInput }
