import { housingHelpRequestRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const housingHelpRequestRouter = router({
  add: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute)
})
