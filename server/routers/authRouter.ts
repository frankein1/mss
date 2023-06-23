import { protectedProcedure, router } from '../trpc'
import { getUserController } from '~/server/controller/auth'

export const authRouter = router({
  getUser: protectedProcedure.query(getUserController)
})
