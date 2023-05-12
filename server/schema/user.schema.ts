import { z } from 'zod'
import { UserRole } from '@prisma/client'
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

const editUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(UserRole)
})

type UserRoleEditionInput = z.infer<typeof editUserRoleSchema>

const editUserAidantConnectAuthorisationSchema = z.object({
  id: z.string().uuid(),
  aidantConnectAuthorisation: z.boolean()
})

type UserAidantConnectAuthorisationEditionInput = z.infer<
  typeof editUserAidantConnectAuthorisationSchema
>

const editUserStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.boolean()
})

type UserStatusEditionInput = z.infer<typeof editUserStatusSchema>

const editUserSchema = z.union([
  editUserRoleSchema,
  editUserAidantConnectAuthorisationSchema,
  editUserStatusSchema
])

type UserEditionInput = z.infer<typeof editUserSchema>

export {
  createUserSchema,
  editUserSchema,
  editUserRoleSchema,
  editUserAidantConnectAuthorisationSchema,
  editUserStatusSchema
}

export type {
  UserCreationInput,
  UserEditionInput,
  UserRoleEditionInput,
  UserAidantConnectAuthorisationEditionInput,
  UserStatusEditionInput
}
