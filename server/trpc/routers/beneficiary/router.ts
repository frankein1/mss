import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema,
  updateBeneficiarySchema,
  getBeneficiariesSchema,
  getDocumentsSchema,
  getHistorySchema,
  exportBeneficiariesSchema,
  updateBeneficiaryGeneralInformationSchema,
  updateBeneficiaryTaxHouseholdSchema,
  updateBeneficiaryEntourageSchema,
  saveDraftSchema
} from '~/server/schema'
import {
  createBeneficiaryHandler,
  getBeneficiariesHandler,
  getBeneficiaryDetailsHandler,
  getBeneficiaryDocumentsHandler,
  updateBeneficiaryHandler,
  searchBeneficiaryHandler,
  getBeneficiaryMinimalInfoHandler,
  getBeneficiarySecurityTargetHandler,
  getBeneficiaryHistoryHandler,
  updateBeneficiaryEntourageHandler,
  saveDraftHandler,
  updateBeneficiaryGeneralInformationHandler,
  updateBeneficiaryTaxHouseholdHandler,
  isBeneficiaryReferentHandler,
  exportBeneficiariesHandler,
  deleteBeneficiaryHandler,
  getBeneficiaryFollowupTypesHandler
} from '~/server/trpc/controller/beneficiary'
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
  updateGeneralInformation: protectedProcedure
    .input(updateBeneficiaryGeneralInformationSchema)
    .mutation(updateBeneficiaryGeneralInformationHandler),
  updateTaxHousehold: protectedProcedure
    .input(updateBeneficiaryTaxHouseholdSchema)
    .mutation(updateBeneficiaryTaxHouseholdHandler),
  updateEntourage: protectedProcedure
    .input(updateBeneficiaryEntourageSchema)
    .mutation(updateBeneficiaryEntourageHandler),
  isBeneficiaryReferent: protectedProcedure
    .input(idSchema)
    .query(isBeneficiaryReferentHandler),
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryMinimalInfoHandler),
  getBeneficiaryDetails: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryDetailsHandler),
  getBeneficiarySecurityTarget: protectedProcedure
    .input(idSchema)
    .query(getBeneficiarySecurityTargetHandler),
  getBeneficiaryDocuments: protectedProcedure
    .input(getDocumentsSchema)
    .query(getBeneficiaryDocumentsHandler),
  getBeneficiaryHistory: protectedProcedure
    .input(getHistorySchema)
    .query(getBeneficiaryHistoryHandler),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiariesSchema)
    .query(getBeneficiariesHandler),
  exportBeneficiaries: protectedProcedure
    .input(exportBeneficiariesSchema)
    .query(exportBeneficiariesHandler),
  delete: protectedProcedure.input(idSchema).mutation(deleteBeneficiaryHandler),
  getBeneficiaryFollowupTypes: protectedProcedure
    .input(idSchema)
    .query(getBeneficiaryFollowupTypesHandler),
  saveDraft: protectedProcedure
    .input(saveDraftSchema)
    .mutation(saveDraftHandler)
})
