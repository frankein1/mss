import { getBeneficiariesUsersActivityQuery } from '~/server/route/usersActivity'
import { protectedProcedure, router } from '~/server/trpc'

export const usersActivityRouter = router({
  beneficiaries: protectedProcedure
    .input(getBeneficiariesUsersActivityQuery.inputValidation)
    .query(getBeneficiariesUsersActivityQuery.execute)
})
