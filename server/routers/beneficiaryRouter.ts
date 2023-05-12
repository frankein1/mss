import {
  createBeneficiaryHandler,
  searchBeneficiaryHandler,
  getBeneficiaryDetailsHandler,
  updateBeneficiaryHandler
} from '../controller/beneficiary.controller'
import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema,
  updateBeneficiarySchema
} from '../schema'

import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(searchBeneficiarySchema)
    .query(searchBeneficiaryHandler),
  add: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler),
  update: protectedProcedure
    .input(updateBeneficiarySchema)
    .mutation(updateBeneficiaryHandler),
  getBeneficiaryDetails: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryDetailsHandler)
})
