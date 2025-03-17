import { z } from 'zod'
import { adminCreateUserSchema } from './adminCreateUser.schema'

const adminEditUserSchema = adminCreateUserSchema.extend({
  id: z.string().uuid()
})

type AdminEditUserInput = z.infer<typeof adminEditUserSchema>

export { adminEditUserSchema }

export type { AdminEditUserInput }
