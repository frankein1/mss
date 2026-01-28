import { router, protectedProcedure } from '~/server/trpc'
import { mesAidesRoutes } from '~/server/route'

export const mesAidesRouter = router({
  prefillSimulation: protectedProcedure
    .input(mesAidesRoutes.prefillSimulation.inputValidation)
    .mutation(mesAidesRoutes.prefillSimulation.execute),
})
