import { workshopRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const workshopRouter = router({
  createWorkshop: protectedProcedure
    .input(routes.createWorkshop.inputValidation)
    .mutation(routes.createWorkshop.execute),
  getPage: protectedProcedure
    .input(routes.getPageQuery.inputValidation)
    .query(routes.getPageQuery.execute)
})
