import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema,
  updateBeneficiarySchema,
  getBeneficiariesSchema
} from '../schema'

import {
  createBeneficiaryHandler,
  getBeneficiariesHandler,
  getBeneficiaryDetailsHandler,
  updateBeneficiaryHandler,
  searchBeneficiaryHandler
} from '../controller/beneficiary'
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
    .query(getBeneficiaryDetailsHandler),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiariesSchema)
    .query(getBeneficiariesHandler)
})
