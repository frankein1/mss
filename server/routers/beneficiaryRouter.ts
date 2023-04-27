import {
  createBeneficiaryHandler,
  searchBeneficiaryHandler
} from '../controller/beneficiary.controller'
import { createBeneficiarySchema } from '../schema'
import { searchBeneficiarySchema } from '../schema/beneficiary.schema'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(searchBeneficiarySchema)
    .query(searchBeneficiaryHandler),
  add: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler)
})
