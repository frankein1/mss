import { redirectionRoutes as routes } from '~~/server/route'
import { protectedProcedure, router } from '~~/server/trpc'

export const redirectionRouter = router({
  getRedirectionReasonList: protectedProcedure
    .input(routes.getRedirectionReasonList.inputValidation)
    .query(routes.getRedirectionReasonList.execute)
})
