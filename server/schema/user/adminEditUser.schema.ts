import { z } from 'zod'
import { adminCreateUserBaseSchema } from './adminCreateUser.schema'
import { requiredErrorMessage } from '~/utils/zod'

const adminEditUserSchema = adminCreateUserBaseSchema
  .extend({
    id: z.string().uuid()
  })
  .refine(({ role, structureId }) => role === 'Administrator' || structureId, {
    message: requiredErrorMessage
  })

type AdminEditUserInput = z.infer<typeof adminEditUserSchema>

export { adminEditUserSchema }

export type { AdminEditUserInput }
