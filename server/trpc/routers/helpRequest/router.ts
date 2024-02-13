import { helpRequestRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const helpRequestRouter = router({
  add: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute),
  getOne: protectedProcedure
    .input(routes.getOne.inputValidation)
    .query(routes.getOne.execute),
  quickUpdate: protectedProcedure
    .input(routes.quickUpdate.inputValidation)
    .mutation(routes.quickUpdate.execute),
  update: protectedProcedure
    .input(routes.update.inputValidation)
    .mutation(routes.update.execute),
  delete: protectedProcedure
    .input(routes.remove.inputValidation)
    .mutation(routes.remove.execute)
})
