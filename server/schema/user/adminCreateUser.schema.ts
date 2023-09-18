import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage,
  requiredNativeEnum,
  requiredErrorMessage,
  stringOrEmpty,
  wordConstraint
} from '~/utils/zod'

const adminCreateUserBaseSchema = z.object({
  firstName: wordConstraint().min(2, minStringLengthMessage(2)),
  lastName: wordConstraint().min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: requiredNativeEnum(UserRole),
  status: requiredNativeEnum(UserStatus),
  aidantConnectAuthorisation: z.coerce.boolean().nullish(),
  structureId: stringOrEmpty(
    z.string(errorMessages).uuid({ message: requiredErrorMessage })
  ).transform(v => (v === '' ? undefined : v))
})

const adminCreateUserSchema = adminCreateUserBaseSchema.refine(
  ({ role, structureId }) => role === 'Administrator' || structureId,
  v => ({ message: `Blabla: ${requiredErrorMessage}: ${v}` })
)

type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export { adminCreateUserSchema, adminCreateUserBaseSchema }

export type { AdminCreateUserInput }
