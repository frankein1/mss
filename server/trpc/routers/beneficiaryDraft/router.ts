import {
  createBeneficiarySchema,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import {
  createBeneficiaryDraftHandler,
  updateBeneficiaryDraftHandler
} from '~/server/trpc/controller/beneficiaryDraft'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryDraftRouter = router({
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryDraftHandler),
  update: protectedProcedure
    .input(updateBeneficiaryDraftSchema)
    .mutation(updateBeneficiaryDraftHandler)
})
