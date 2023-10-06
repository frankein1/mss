import { protectedProcedure, router } from '~/server/trpc'
import {
  acceptCGUMutation,
  addUserMutation,
  updateUserMutation,
  getUsersQuery
} from '~/server/route/user'

export const userRouter = router({
  update: protectedProcedure
    .input(updateUserMutation.inputValidation)
    .mutation(updateUserMutation.execute),
  add: protectedProcedure
    .input(addUserMutation.inputValidation)
    .mutation(addUserMutation.execute),
  getUsers: protectedProcedure
    .input(getUsersQuery.inputValidation)
    .query(getUsersQuery.execute),
  acceptCGU: protectedProcedure
    .input(acceptCGUMutation.inputValidation)
    .mutation(acceptCGUMutation.execute)
})
