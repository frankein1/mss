import { getBeneficiariesUsersActivityHandler } from '~/server/controller/usersActivity'
import { protectedProcedure, router } from '~/server/trpc'
import { paginatedSchema } from '~/server/schema'

export const usersActivityRouter = router({
  beneficiaries: protectedProcedure
    .input(paginatedSchema)
    .query(getBeneficiariesUsersActivityHandler)
})
