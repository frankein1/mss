import { socialSupportRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const socialSupportRouter = router({
  remove: protectedProcedure
    .input(routes.remove.inputValidation)
    .mutation(routes.remove.execute)
})
