import {
  getBeneficiaryCreationPermissionsQuery,
  getFileInstructionPermissionsQuery
} from '~/server/route/permissions'
import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getBeneficiaryCreationPermissions: protectedProcedure
    .input(getBeneficiaryCreationPermissionsQuery.inputValidation)
    .query(getBeneficiaryCreationPermissionsQuery.execute),
  getFileInstructionPermissions: protectedProcedure
    .input(getFileInstructionPermissionsQuery.inputValidation)
    .query(getFileInstructionPermissionsQuery.execute)
})
