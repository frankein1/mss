import { protectedProcedure, router } from '~/server/trpc'
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
  deleteBeneficiaryHandler,
  isBeneficiaryReferentHandler,
  getBeneficiaryFollowupTypesHandler,
  exportBeneficiariesHandler,
  updateBeneficiaryGeneralInformationHandler,
  updateBeneficiaryTaxHouseholdHandler,
  updateBeneficiaryEntourageHandler,
  saveDraftHandler
} from '~/server/trpc/controller/beneficiary'

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

// const requests: Request[] = [
//   createQuery({
//     path: 'search',
//     inputValidation: searchBeneficiarySchema,
//     securityCheck: AllowSecurityCheck,
//     handler: searchBeneficiaryHandler
//   }),
//   createMutation({
//     path: 'create',
//     inputValidation: createBeneficiarySchema,
//     securityCheck: AllowSecurityCheck,
//     handler: createBeneficiaryHandler
//   }),
//   createMutation({
//     path: 'update',
//     inputValidation: updateBeneficiarySchema,
//     securityCheck: AllowSecurityCheck,
//     handler: updateBeneficiaryHandler
//   }),
//   createMutation({
//     path: 'updateGeneralInformation',
//     inputValidation: updateBeneficiaryGeneralInformationSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: updateBeneficiaryGeneralInformationHandler
//   }),
//   createMutation({
//     path: 'updateTaxHousehold',
//     inputValidation: updateBeneficiaryTaxHouseholdSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: updateBeneficiaryTaxHouseholdHandler
//   }),
//   createQuery({
//     path: 'isBeneficiaryReferent',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: isBeneficiaryReferentHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaryMinimalInfo',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiaryMinimalInfoHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaryDetails',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiaryDetailsHandler
//   }),
//   createQuery({
//     path: 'getBeneficiarySecurityTarget',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiarySecurityTargetHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaryDocuments',
//     inputValidation: getDocumentsSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiaryDocumentsHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaryHistory',
//     inputValidation: getHistorySchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiaryHistoryHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaries',
//     inputValidation: getBeneficiariesSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiariesHandler
//   }),
//   createQuery({
//     path: 'exportBeneficiaries',
//     inputValidation: exportBeneficiariesSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: exportBeneficiariesHandler
//   }),
//   createMutation({
//     path: 'delete',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: deleteBeneficiaryHandler
//   }),
//   createQuery({
//     path: 'getBeneficiaryFollowupTypes',
//     inputValidation: idSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: getBeneficiaryFollowupTypesHandler
//   }),
//   createMutation({
//     path: 'saveDraft',
//     inputValidation: saveDraftSchema,
//     securityCheck: AllowSecurityCheck,
//     handler: saveDraftHandler
//   })
// ]
// export const beneficiaryRouter = buildRouter(requests)
