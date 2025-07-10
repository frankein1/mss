import { workshopRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const workshopRouter = router({
  createWorkshop: protectedProcedure
    .input(routes.createWorkshop.inputValidation)
    .mutation(routes.createWorkshop.execute),
  getPage: protectedProcedure
    .input(routes.getPageQuery.inputValidation)
    .query(routes.getPageQuery.execute),
  getWorkshopNameList: protectedProcedure
    .input(routes.getWorkshopNameList.inputValidation)
    .query(routes.getWorkshopNameList.execute),
  getOne: protectedProcedure
    .input(routes.getQuery.inputValidation)
    .query(routes.getQuery.execute),
  delete: protectedProcedure
    .input(routes.deleteWorkshop.inputValidation)
    .mutation(routes.deleteWorkshop.execute),
  updateWorkshop: protectedProcedure
    .input(routes.updateWorkshop.inputValidation)
    .mutation(routes.updateWorkshop.execute)
})
