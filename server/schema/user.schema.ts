import { z } from 'zod'
import { UserStatus, UserRole } from '~/server/prisma/prismaClient'
import { NonAdminUserRole } from '~/client/options/user'
import {
  errorMessages,
  minStringLengthMessage,
  validEmailMessage
} from '~/utils/zod'

const createUserSchema = z.object({
  firstName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  lastName: z.string(errorMessages).min(2, minStringLengthMessage(2)),
  email: z.string(errorMessages).email(validEmailMessage),
  role: z.nativeEnum(NonAdminUserRole, {
    ...errorMessages,
    required_error: 'Veuillez renseigner le rôle'
  })
})

type UserCreationInput = z.infer<typeof createUserSchema>

const editUserSchema = z
  .object({
    id: z.string().uuid(),
    status: z.nativeEnum(UserStatus).optional(),
    role: z.nativeEnum(UserRole).optional(),
    aidantConnectAuthorisation: z.boolean().nullable().optional()
  })
  .refine(
    ({ status, role, aidantConnectAuthorisation }) =>
      status !== undefined ||
      role !== undefined ||
      aidantConnectAuthorisation !== undefined
  )

type UserEditionInput = z.infer<typeof editUserSchema>

export { createUserSchema, editUserSchema }

export type { UserCreationInput, UserEditionInput }
