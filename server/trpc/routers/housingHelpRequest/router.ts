import { housingHelpRequestRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const housingHelpRequestRouter = router({
  add: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute),
  getOne: protectedProcedure
    .input(routes.getOne.inputValidation)
    .query(routes.getOne.execute),
  getPage: protectedProcedure
    .input(routes.getPage.inputValidation)
    .query(routes.getPage.execute)
})
