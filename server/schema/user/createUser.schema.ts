import { z } from 'zod'
import { NonAdminUserRole } from '~/types/user'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  requiredNativeEnum,
  wordConstraint
} from '~/utils/zod'

const createUserSchema = z.object({
  firstName: wordConstraint().min(2, minStringLengthMessage(2)),
  lastName: wordConstraint().min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: requiredNativeEnum(NonAdminUserRole)
})

type UserCreationInput = z.infer<typeof createUserSchema>

export { createUserSchema }

export type { UserCreationInput }
