import { authProcedure, router } from '..'
import { getUserHandler } from '~/server/route/auth'
import { emptySchema } from '~/server/schema'

export const authRouter = router({
  getUser: authProcedure.input(emptySchema).query(getUserHandler)
})
