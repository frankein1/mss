import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum, stringConstraint } from '../helpers.schema'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validEmailMessage,
  requiredErrorMessage
} from '~/utils/zod'
import { cleanEmail } from '~/utils/user'

const adminCreateUserSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2)),
  email: z
    .string(errorMessages)
    .email(validEmailMessage)
    .transform(e => cleanEmail(e)), // transform to lowercase and trim emails
  role: requiredNativeEnum(UserRole).refine(role => role !== 'Administrator', {
    message:
      "Un administrateur ne peut pas être créé via l'interface d'administration"
  }),
  status: requiredNativeEnum(UserStatus),
  aidantConnectAuthorisation: z.coerce.boolean().nullish(),
  structureId: z.string(errorMessages).uuid({ message: requiredErrorMessage })
})

type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export { adminCreateUserSchema }

export type { AdminCreateUserInput }
