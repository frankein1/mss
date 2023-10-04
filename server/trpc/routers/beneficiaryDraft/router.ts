import {
  createBeneficiaryDraftMutation,
  updateBeneficiaryDraftMutation
} from '~/server/request/beneficiaryDraft'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryDraftRouter = router({
  create: protectedProcedure
    .input(createBeneficiaryDraftMutation.inputValidation)
    .mutation(createBeneficiaryDraftMutation.execute),
  update: protectedProcedure
    .input(updateBeneficiaryDraftMutation.inputValidation)
    .mutation(updateBeneficiaryDraftMutation.execute)
})
