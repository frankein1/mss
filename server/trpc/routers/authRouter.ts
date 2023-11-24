import { authProcedure, router } from '..'
import { getUserHandler } from '~/server/route/auth'

export const authRouter = router({
  getUser: authProcedure.query(getUserHandler)
})
