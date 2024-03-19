import { protectedProcedure, router } from '~/server/trpc'
import { socialSupportSubjectRoutes as routes } from '~/server/route'

export const socialSupportSubjectRouter = router({
  get: protectedProcedure
    .input(routes.get.inputValidation)
    .query(routes.get.execute),
  update: protectedProcedure
    .input(routes.update.inputValidation)
    .mutation(routes.update.execute),
  makeInactive: protectedProcedure
    .input(routes.makeInactive.inputValidation)
    .mutation(routes.makeInactive.execute)
})
