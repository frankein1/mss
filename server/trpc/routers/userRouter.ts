import {
  updateUserHandler,
  addUserHandler,
  getUsersHandler,
  acceptCGUHandler
} from '~/server/trpc/controller/user.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { editUserSchema, createUserSchema } from '~/server/schema'

export const userRouter = router({
  update: protectedProcedure.input(editUserSchema).mutation(updateUserHandler),
  add: protectedProcedure.input(createUserSchema).mutation(addUserHandler),
  getUsers: protectedProcedure.query(getUsersHandler),
  acceptCGU: protectedProcedure.mutation(acceptCGUHandler)
})
