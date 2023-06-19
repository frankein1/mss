import { publicProcedure, router } from '../trpc'
import { adminLoginSchema } from '~/server/schema'
import { loginHandler } from '~/server/controller/admin'

export const adminRouter = router({
  login: publicProcedure.input(adminLoginSchema).mutation(loginHandler)
})
