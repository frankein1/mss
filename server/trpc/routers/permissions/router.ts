import { permissionsRoutes as routes } from '~/server/route/permissions'
import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getBeneficiaryCreationPermissions: protectedProcedure
    .input(routes.getBeneficiaryCreationPermissionsQuery.inputValidation)
    .query(routes.getBeneficiaryCreationPermissionsQuery.execute),
  getFileInstructionPermissions: protectedProcedure
    .input(routes.getFileInstructionPermissionsQuery.inputValidation)
    .query(routes.getFileInstructionPermissionsQuery.execute)
})
