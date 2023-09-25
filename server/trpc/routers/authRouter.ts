import { protectedProcedure, router } from '..'
import { getUserController } from '~/server/trpc/controller/auth'

export const authRouter = router({
  getUser: protectedProcedure.query(getUserController)
})
