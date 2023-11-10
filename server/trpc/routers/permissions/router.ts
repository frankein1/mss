import { getBeneficiaryCreationPermissionsQuery } from '~/server/route/permissions/get-beneficiary-creation-permissions.query'

import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getBeneficiaryCreationPermissions: protectedProcedure
    .input(getBeneficiaryCreationPermissionsQuery.inputValidation)
    .query(getBeneficiaryCreationPermissionsQuery.execute)
})
