import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  enumErrorMap
} from '~/utils/zod'

const adminEditUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  lastName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: z.nativeEnum(UserRole, {
    errorMap: enumErrorMap
  }),
  status: z.nativeEnum(UserStatus, {
    errorMap: enumErrorMap
  }),
  aidantConnectAuthorisation: z.boolean(),
  structureId: z.string().uuid()
})

type AdminEditUserInput = z.infer<typeof adminEditUserSchema>

export { adminEditUserSchema }

export type { AdminEditUserInput }
