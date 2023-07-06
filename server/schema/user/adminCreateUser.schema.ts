import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  requiredNativeEnum
} from '~/utils/zod'

const adminCreateUserSchema = z.object({
  firstName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  lastName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: requiredNativeEnum(UserRole),
  status: requiredNativeEnum(UserStatus),
  aidantConnectAuthorisation: z.boolean(),
  structureId: z.string().uuid()
})

type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export { adminCreateUserSchema }

export type { AdminCreateUserInput }
