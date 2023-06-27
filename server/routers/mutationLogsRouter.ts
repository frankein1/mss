import { getBeneficiariesMutationLogsHandler } from '~/server/controller/mutationLogs'
import { protectedProcedure, router } from '~/server/trpc'

export const mutationLogsRouter = router({
  beneficiaries: protectedProcedure.query(getBeneficiariesMutationLogsHandler)
})
