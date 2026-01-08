import { NonAdminUserRole } from '~/types/user'
import { z } from 'zod'
import { requiredNativeEnum, stringConstraint } from '../helpers.schema'
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
  email: z.string(errorMessages).email(validEmailMessage),
  // User cannot create an Administrator or update to an Administrator
  role: requiredNativeEnum(NonAdminUserRole),
  aidantConnectAuthorisation: z.coerce.boolean().nullish()
})
type CreateUserInput = z.infer<typeof createUserSchema>

const editUserSchema = createUserSchema.extend({
  id: z.string().uuid(),
  status: z.boolean().default(false)
})
type UpdateUserInput = z.infer<typeof editUserSchema>

const getUserSchema = z.object({
  id: z.string().uuid()
})
type GetUserInput = z.infer<typeof getUserSchema>

const deleteUserShema = z.object({
  id: z.string().uuid()
})
type DeleteUserInput = z.infer<typeof deleteUserShema>

export { createUserSchema, editUserSchema, getUserSchema, deleteUserShema }

export type { CreateUserInput, UpdateUserInput, GetUserInput, DeleteUserInput }
