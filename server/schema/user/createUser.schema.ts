import { z } from 'zod/v4'
import { requiredNativeEnum, stringConstraint } from '../helpers.schema'
import { NonAdminUserRole } from '~/types/user'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validEmailMessage
} from '~/utils/zod'

const createUserSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2)),
  email: z.email(errorMessages),
  role: requiredNativeEnum(NonAdminUserRole)
})

type UserCreationInput = z.infer<typeof createUserSchema>

export { createUserSchema }

export type { UserCreationInput }
