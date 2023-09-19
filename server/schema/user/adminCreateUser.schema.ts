import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validEmailMessage,
  requiredNativeEnum,
  requiredErrorMessage,
  stringOrEmpty,
  stringConstraint
} from '~/utils/zod'

const adminCreateUserBaseSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2)),
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
