import { createBeneficiarySchema, idSchema } from '~/server/schema'
import {
  createBeneficiaryDraftHandler,
  getBeneficiaryDraftHandler,
  deleteBeneficiaryDraftHandler
} from '~/server/controller/beneficiaryDraft'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryDraftRouter = router({
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryDraftHandler),
  get: protectedProcedure.input(idSchema).query(getBeneficiaryDraftHandler),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(deleteBeneficiaryDraftHandler)
})
