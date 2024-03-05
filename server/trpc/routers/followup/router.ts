import { followupRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const followupRouter = router({
  add: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute),
  getPage: protectedProcedure
    .input(routes.getPage.inputValidation)
    .query(routes.getPage.execute),
  getExport: protectedProcedure
    .input(routes.getExport.inputValidation)
    .query(routes.getExport.execute),
  update: protectedProcedure
    .input(routes.update.inputValidation)
    .mutation(routes.update.execute),
  getOne: protectedProcedure
    .input(routes.getOne.inputValidation)
    .query(routes.getOne.execute),
  delete: protectedProcedure
    .input(routes.remove.inputValidation)
    .mutation(routes.remove.execute),
  getOngoing: protectedProcedure
    .input(routes.getOngoing.inputValidation)
    .query(routes.getOngoing.execute)
})
