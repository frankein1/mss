import {
  idSchema,
  searchBeneficiarySchema,
  createBeneficiarySchema,
  getBeneficiariesSchema,
  getDocumentsSchema,
  getHistorySchema,
  exportBeneficiariesSchema,
  updateBeneficiaryGeneralInformationSchema,
  updateBeneficiaryTaxHouseholdSchema,
  updateBeneficiaryEntourageSchema,
  updateBeneficiaryHealthSchema,
  updateBeneficiaryOccupationSchema,
  updateBeneficiaryExternalOrganisationsSchema,
  saveDraftSchema
} from '~/server/schema'
import {
  createBeneficiaryHandler,
  getBeneficiariesHandler,
  getBeneficiaryDetailsHandler,
  getBeneficiaryDocumentsHandler,
  searchBeneficiaryHandler,
  getBeneficiaryMinimalInfoHandler,
  getBeneficiarySecurityTargetHandler,
  getBeneficiaryHistoryHandler,
  deleteBeneficiaryHandler,
  isBeneficiaryReferentHandler,
  getBeneficiaryFollowupTypesHandler,
  exportBeneficiariesHandler,
  updateBeneficiaryGeneralInformationHandler,
  updateBeneficiaryTaxHouseholdHandler,
  updateBeneficiaryEntourageHandler,
  updateBeneficiaryHealthHandler,
  updateBeneficiaryOccupationIncomeHandler,
  updateBeneficiaryExternalOrganisationsHandler,
  saveDraftHandler
} from '~/server/trpc/controller/beneficiary'
import { protectedProcedure, router } from '~/server/trpc'

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(searchBeneficiarySchema)
    .query(searchBeneficiaryHandler),
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(createBeneficiaryHandler),
  updateGeneralInformation: protectedProcedure
    .input(updateBeneficiaryGeneralInformationSchema)
    .mutation(updateBeneficiaryGeneralInformationHandler),
  updateTaxHousehold: protectedProcedure
    .input(updateBeneficiaryTaxHouseholdSchema)
    .mutation(updateBeneficiaryTaxHouseholdHandler),
  updateEntourage: protectedProcedure
    .input(updateBeneficiaryEntourageSchema)
    .mutation(updateBeneficiaryEntourageHandler),
  updateHealth: protectedProcedure
    .input(updateBeneficiaryHealthSchema)
    .mutation(updateBeneficiaryHealthHandler),
  updateOccupationIncome: protectedProcedure
    .input(updateBeneficiaryOccupationSchema)
    .mutation(updateBeneficiaryOccupationIncomeHandler),
  updateExternalOrganisations: protectedProcedure
    .input(updateBeneficiaryExternalOrganisationsSchema)
    .mutation(updateBeneficiaryExternalOrganisationsHandler),
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
