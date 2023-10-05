import { protectedProcedure, router } from '..'
import { getUserQuery } from '~/server/request/admin'

export const authRouter = router({
  getUser: protectedProcedure
    .input(getUserQuery.inputValidation)
    .query(getUserQuery.execute)
})
