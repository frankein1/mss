import { createBeneficiaryHandler } from '../controller/beneficiary.controller'
import { createBeneficiarySchema } from '../schema'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  add: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler)
})
