import {
  createBeneficiaryHandler,
  searchBeneficiaryHandler,
  getBeneficiaryDetailsHandler
} from '../controller/beneficiary.controller'
import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema
} from '../schema/beneficiary.schema'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(searchBeneficiarySchema)
    .query(searchBeneficiaryHandler),
  add: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler),
  getBeneficiaryDetails: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryDetailsHandler)
})
