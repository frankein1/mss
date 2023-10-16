import { UserRole } from '@prisma/client'
import { z } from 'zod'
import { requiredNativeEnum } from '../helpers.schema'

const editUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: requiredNativeEnum(UserRole)
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
  editUserSchema,
  editUserRoleSchema,
  editUserAidantConnectAuthorisationSchema,
  editUserStatusSchema
}

export type {
  UserEditionInput,
  UserRoleEditionInput,
  UserAidantConnectAuthorisationEditionInput,
  UserStatusEditionInput
}
