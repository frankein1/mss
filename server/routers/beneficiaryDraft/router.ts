import {
  createBeneficiarySchema,
  idSchema,
  updateBeneficiaryDraftSchema,
  saveToBeneficiarySchema
} from '~/server/schema'
import {
  createBeneficiaryDraftHandler,
  getBeneficiaryDraftHandler,
  updateBeneficiaryDraftHandler,
  saveToBeneficiaryHandler,
  deleteBeneficiaryDraftHandler
} from '~/server/controller/beneficiaryDraft'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryDraftRouter = router({
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryDraftHandler),
  get: protectedProcedure.input(idSchema).query(getBeneficiaryDraftHandler),
  update: protectedProcedure
    .input(updateBeneficiaryDraftSchema)
    .mutation(updateBeneficiaryDraftHandler),
  saveToBeneficiary: protectedProcedure
    .input(saveToBeneficiarySchema)
    .mutation(saveToBeneficiaryHandler),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(deleteBeneficiaryDraftHandler)
})
