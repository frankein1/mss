import { router, protectedProcedure } from '~/server/trpc'
import { budgetRoutes } from '~/server/route'

export const budgetRouter = router({
  updateInfo: protectedProcedure
    .input(budgetRoutes.updateInfo.inputValidation)
    .mutation(budgetRoutes.updateInfo.execute)
})
