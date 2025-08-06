import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod/v4'
import { requiredNativeEnum, stringConstraint } from '../helpers.schema'
import {
  errorMessages,
  minStringLengthMessage,
  maxStringLengthMessage,
  validEmailMessage,
  requiredErrorMessage
} from '~/utils/zod'

const adminCreateUserSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2)),
  email: z.email(errorMessages),
  role: requiredNativeEnum(UserRole).refine(role => role !== 'Administrator', {
      error: "Un administrateur ne peut pas être créé via l'interface d'administration"
}),
  status: requiredNativeEnum(UserStatus),
  aidantConnectAuthorisation: z.coerce.boolean().nullish(),
  structureId: z.uuid(errorMessages)
})

type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export { adminCreateUserSchema }

export type { AdminCreateUserInput }
