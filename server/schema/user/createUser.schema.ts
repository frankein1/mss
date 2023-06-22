import { z } from 'zod'
import { NonAdminUserRole } from '~/client/options/user'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  enumErrorMap
} from '~/utils/zod'

const createUserSchema = z.object({
  firstName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  lastName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: z.nativeEnum(NonAdminUserRole, {
    errorMap: enumErrorMap
  })
})

type UserCreationInput = z.infer<typeof createUserSchema>

export { createUserSchema }

export type { UserCreationInput }
