import { fileInstructionRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const fileInstructionRouter = router({
  getPage: protectedProcedure
    .input(routes.getPage.inputValidation)
    .query(routes.getPage.execute),
  exportFileInstructions: protectedProcedure
    .input(routes.exportFileInstructions.inputValidation)
    .query(routes.exportFileInstructions.execute),
  updateStatus: protectedProcedure
    .input(routes.updateStatus.inputValidation)
    .mutation(routes.updateStatus.execute),
  getOngoing: protectedProcedure
    .input(routes.getOngoing.inputValidation)
    .query(routes.getOngoing.execute)
})
