import { ministerRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const ministerRouter = router({
  getMinisters: protectedProcedure
    .input(routes.getMinisters.inputValidation)
    .query(routes.getMinisters.execute)
})
