import {
  createBeneficiaryDraftMutation,
  deleteBeneficiaryDraftMutation,
  getBeneficiaryDraftQuery,
  updateBeneficiaryDraftMutation
} from '~/server/route/beneficiaryDraft'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryDraftRouter = router({
  create: protectedProcedure
    .input(createBeneficiaryDraftMutation.inputValidation)
    .mutation(createBeneficiaryDraftMutation.execute),
  update: protectedProcedure
    .input(updateBeneficiaryDraftMutation.inputValidation)
    .mutation(updateBeneficiaryDraftMutation.execute),
  get: protectedProcedure
    .input(getBeneficiaryDraftQuery.inputValidation)
    .query(getBeneficiaryDraftQuery.execute),
  delete: protectedProcedure
    .input(deleteBeneficiaryDraftMutation.inputValidation)
    .mutation(deleteBeneficiaryDraftMutation.execute)
})
