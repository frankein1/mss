import { getUserInfoHandler } from '../controller/user.controller'
import { protectedProcedure, router } from '~/server/trpc'

export const userRouter = router({
  getUserInfo: protectedProcedure.query(getUserInfoHandler)
})
