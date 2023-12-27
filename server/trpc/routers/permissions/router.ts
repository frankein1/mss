import {
  getBeneficiaryCreationPermissionsQuery,
  getHelpRequestPermissionsQuery
} from '~/server/route/permissions'
import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getBeneficiaryCreationPermissions: protectedProcedure
    .input(getBeneficiaryCreationPermissionsQuery.inputValidation)
    .query(getBeneficiaryCreationPermissionsQuery.execute),
  getHelpRequestPermissions: protectedProcedure
    .input(getHelpRequestPermissionsQuery.inputValidation)
    .query(getHelpRequestPermissionsQuery.execute)
})
