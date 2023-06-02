import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema,
  updateBeneficiarySchema,
  getBeneficiariesSchema,
  getDocumentsSchema,
  addDocumentSchema
} from '../schema'

import {
  createBeneficiaryHandler,
  getBeneficiariesHandler,
  getBeneficiaryDetailsHandler,
  getBeneficiaryDocumentsHandler,
  addDocumentHandler,
  updateBeneficiaryHandler,
  searchBeneficiaryHandler,
  getBeneficiaryMinimalInfoHandler
} from '../controller/beneficiary'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(searchBeneficiarySchema)
    .query(searchBeneficiaryHandler),
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler),
  update: protectedProcedure
    .input(updateBeneficiarySchema)
    .mutation(updateBeneficiaryHandler),
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryMinimalInfoHandler),
  getBeneficiaryDetails: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryDetailsHandler),
  getBeneficiaryDocuments: protectedProcedure
    .input(getDocumentsSchema)
    .query(getBeneficiaryDocumentsHandler),
  addBeneficiaryDocument: protectedProcedure
    .input(addDocumentSchema)
    .query(addDocumentHandler),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiariesSchema)
    .query(getBeneficiariesHandler)
})
