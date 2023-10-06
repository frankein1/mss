import { getBeneficiariesUsersActivityQuery } from '~/server/request/usersActivity'
import { protectedProcedure, router } from '~/server/trpc'

export const usersActivityRouter = router({
  beneficiaries: protectedProcedure
    .input(getBeneficiariesUsersActivityQuery.inputValidation)
    .query(getBeneficiariesUsersActivityQuery.execute)
})
