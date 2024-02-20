import { partnerRoutes as routes } from '~/server/route'

import { protectedProcedure, router } from '~/server/trpc'

export const partnerRouter = router({
  create: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute),
  update: protectedProcedure
    .input(routes.update.inputValidation)
    .mutation(routes.update.execute),
  getAll: protectedProcedure
    .input(routes.getAll.inputValidation)
    .query(routes.getAll.execute),
  getOne: protectedProcedure
    .input(routes.getOne.inputValidation)
    .query(routes.getOne.execute),
  findBySiret: protectedProcedure
    .input(routes.findBySiret.inputValidation)
    .query(routes.findBySiret.execute),
  remove: protectedProcedure
    .input(routes.remove.inputValidation)
    .mutation(routes.remove.execute)
})
