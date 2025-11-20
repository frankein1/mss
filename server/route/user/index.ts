import { acceptCGUMutation } from './acceptCGU.mutation'
import { addUserMutation } from './addUser.mutation'
import { getUsersQuery } from './getUsers.query'
import { updateUserMutation } from './updateUser.mutation'
import { deleteUserMutation } from './deleteUser.mutation'
import { authorizeExportMutation } from './authorize-export.mutation'
import { getUserQuery } from './get.query'

export const userRoutes = {
  acceptCGUMutation,
  addUserMutation,
  getUsersQuery,
  updateUserMutation,
  deleteUserMutation,
  authorizeExportMutation,
  getUserQuery
}
