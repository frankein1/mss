import {
  getUserInfoHandler,
  updateUserHandler,
  addUserHandler,
  getUsersHandler
} from '../controller/user.controller'
import { protectedProcedure, router } from '~/server/trpc'
import { editUserSchema, createUserSchema } from '~/server/schema'

export const userRouter = router({
  getUserInfo: protectedProcedure.query(getUserInfoHandler),
  update: protectedProcedure.input(editUserSchema).mutation(updateUserHandler),
  add: protectedProcedure.input(createUserSchema).mutation(addUserHandler),
  getUsers: protectedProcedure.query(getUsersHandler)
})
