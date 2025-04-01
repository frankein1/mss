import { acceptCGUMutation } from './acceptCGU.mutation'
import { addUserMutation } from './addUser.mutation'
import { getUsersQuery } from './getUsers.query'
import { updateUserMutation } from './updateUser.mutation'
import { authorizeExportMutation } from './authorize-export.mutation'

export const userRoutes = {
  acceptCGUMutation,
  addUserMutation,
  getUsersQuery,
  updateUserMutation,
  authorizeExportMutation
}
