import { protectedProcedure, router } from '~/server/trpc'
import { dataInclusionRoutes } from '~/server/route'

export const dataInclusionRouter = router({
  searchStructures: protectedProcedure
    .input(dataInclusionRoutes.searchStructures.inputValidation)
    .query(dataInclusionRoutes.searchStructures.execute)
})
