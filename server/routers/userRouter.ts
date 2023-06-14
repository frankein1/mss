import {
  updateUserHandler,
  addUserHandler,
  getUsersHandler
} from '~/server/controller/user.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { editUserSchema, createUserSchema } from '~/server/schema'

export const userRouter = router({
  update: protectedProcedure.input(editUserSchema).mutation(updateUserHandler),
  add: protectedProcedure.input(createUserSchema).mutation(addUserHandler),
  getUsers: protectedProcedure.query(getUsersHandler)
})
