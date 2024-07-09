import { familyFileRoutes as routes } from '~/server/route'
import { protectedProcedure, router } from '~/server/trpc'

export const fileRouter = router({
  getSocialSupports: protectedProcedure
    .input(routes.getSocialSupports.inputValidation)
    .query(routes.getSocialSupports.execute)
})
