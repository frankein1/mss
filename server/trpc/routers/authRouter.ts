import { protectedProcedure, router } from '..'
import { getUserQuery } from '~/server/route/auth'

export const authRouter = router({
  getUser: protectedProcedure
    .input(getUserQuery.inputValidation)
    .query(getUserQuery.execute)
})
