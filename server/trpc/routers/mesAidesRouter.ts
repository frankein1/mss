import { router, protectedProcedure } from '~/server/trpc'
import { mesAidesRoutes } from '~/server/route'

export const mesAidesRouter = router({
  startSimulation: protectedProcedure
    .input(mesAidesRoutes.startSimulation.inputValidation)
    .mutation(mesAidesRoutes.startSimulation.execute),
})
