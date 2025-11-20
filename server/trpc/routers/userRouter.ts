import { protectedProcedure, router } from '~/server/trpc'
import { userRoutes as routes } from '~/server/route'

export const userRouter = router({
  update: protectedProcedure
    .input(routes.updateUserMutation.inputValidation)
    .mutation(routes.updateUserMutation.execute),
  delete: protectedProcedure
    .input(routes.deleteUserMutation.inputValidation)
    .mutation(routes.deleteUserMutation.execute),
  add: protectedProcedure
    .input(routes.addUserMutation.inputValidation)
    .mutation(routes.addUserMutation.execute),
  getUsers: protectedProcedure
    .input(routes.getUsersQuery.inputValidation)
    .query(routes.getUsersQuery.execute),
  acceptCGU: protectedProcedure
    .input(routes.acceptCGUMutation.inputValidation)
    .mutation(routes.acceptCGUMutation.execute),
  authorizeExport: protectedProcedure
    .input(routes.authorizeExportMutation.inputValidation)
    .mutation(routes.authorizeExportMutation.execute),
  get: protectedProcedure
    .input(routes.getUserQuery.inputValidation)
    .query(routes.getUserQuery.execute)
})
