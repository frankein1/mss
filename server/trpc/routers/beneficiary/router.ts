import { createMutation, createQuery } from '../../request/createRequest'
import { protectedProcedure, router } from '../..'
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
  saveDraftHandler,
  updateBeneficiaryEntourageHandler
} from '~/server/trpc/controller/beneficiary'
import { AllowSecurityCheck } from '~/server/security/rules/types'

// MUTATION

const saveDraft = createMutation({
  path: 'saveDraft',
  inputValidation: saveDraftSchema,
  securityCheck: AllowSecurityCheck,
  handler: saveDraftHandler
})
const updateBeneficiaryEntourage = createMutation({
  path: 'updateBeneficiaryEntourage',
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryEntourageHandler
})

const create = createMutation({
  path: 'create',
  inputValidation: createBeneficiarySchema,
  securityCheck: AllowSecurityCheck,
  handler: createBeneficiaryHandler
})
const update = createMutation({
  path: 'update',
  inputValidation: updateBeneficiarySchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryHandler
})
const updateGeneralInformation = createMutation({
  path: 'updateGeneralInformation',
  inputValidation: updateBeneficiaryGeneralInformationSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryGeneralInformationHandler
})
const updateTaxHousehold = createMutation({
  path: 'updateTaxHousehold',
  inputValidation: updateBeneficiaryTaxHouseholdSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryTaxHouseholdHandler
})

const deleteMutation = createMutation({
  path: 'delete',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: deleteBeneficiaryHandler
})

const updateEntourage = createMutation({
  path: 'updateEntourage',
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryEntourageHandler
})

// QUERY
const search = createQuery({
  path: 'search',
  inputValidation: searchBeneficiarySchema,
  securityCheck: AllowSecurityCheck,
  handler: searchBeneficiaryHandler
})

const isBeneficiaryReferent = createQuery({
  path: 'isBeneficiaryReferent',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: isBeneficiaryReferentHandler
})
const getBeneficiaryMinimalInfo = createQuery({
  path: 'getBeneficiaryMinimalInfo',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiaryMinimalInfoHandler
})
const getBeneficiaryDetails = createQuery({
  path: 'getBeneficiaryDetails',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiaryDetailsHandler
})
const getBeneficiarySecurityTarget = createQuery({
  path: 'getBeneficiarySecurityTarget',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiarySecurityTargetHandler
})
const getBeneficiaryDocuments = createQuery({
  path: 'getBeneficiaryDocuments',
  inputValidation: getDocumentsSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiaryDocumentsHandler
})
const getBeneficiaryHistory = createQuery({
  path: 'getBeneficiaryHistory',
  inputValidation: getHistorySchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiaryHistoryHandler
})
const getBeneficiaries = createQuery({
  path: 'getBeneficiaries',
  inputValidation: getBeneficiariesSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiariesHandler
})
const exportBeneficiaries = createQuery({
  path: 'exportBeneficiaries',
  inputValidation: exportBeneficiariesSchema,
  securityCheck: AllowSecurityCheck,
  handler: exportBeneficiariesHandler
})

const getBeneficiaryFollowupTypes = createQuery({
  path: 'getBeneficiaryFollowupTypes',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: getBeneficiaryFollowupTypesHandler
})

export const beneficiaryRouter = router({
  isBeneficiaryReferent: protectedProcedure
    .input(isBeneficiaryReferent.inputValidation)
    .query(isBeneficiaryReferent.handler),
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(getBeneficiaryMinimalInfo.inputValidation)
    .query(getBeneficiaryMinimalInfo.handler),
  getBeneficiaryDetails: protectedProcedure
    .input(getBeneficiaryDetails.inputValidation)
    .query(getBeneficiaryDetails.handler),
  getBeneficiarySecurityTarget: protectedProcedure
    .input(getBeneficiarySecurityTarget.inputValidation)
    .query(getBeneficiarySecurityTarget.handler),
  getBeneficiaryHistory: protectedProcedure
    .input(getBeneficiaryHistory.inputValidation)
    .query(getBeneficiaryHistory.handler),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiaries.inputValidation)
    .query(getBeneficiaries.handler),
  exportBeneficiaries: protectedProcedure
    .input(exportBeneficiaries.inputValidation)
    .query(exportBeneficiaries.handler),
  search: protectedProcedure
    .input(search.inputValidation)
    .query(search.handler),
  getBeneficiaryFollowupTypes: protectedProcedure
    .input(getBeneficiaryFollowupTypes.inputValidation)
    .query(getBeneficiaryFollowupTypes.handler),
  getBeneficiaryDocuments: protectedProcedure
    .input(getBeneficiaryDocuments.inputValidation)
    .query(getBeneficiaryDocuments.handler),

  delete: protectedProcedure
    .input(deleteMutation.inputValidation)
    .mutation(deleteMutation.handler),
  updateGeneralInformation: protectedProcedure
    .input(updateGeneralInformation.inputValidation)
    .mutation(updateGeneralInformation.handler),
  update: protectedProcedure
    .input(update.inputValidation)
    .mutation(update.handler),
  updateTaxHousehold: protectedProcedure
    .input(updateTaxHousehold.inputValidation)
    .mutation(updateTaxHousehold.handler),
  create: protectedProcedure
    .input(create.inputValidation)
    .mutation(create.handler),
  updateBeneficiaryEntourage: protectedProcedure
    .input(updateBeneficiaryEntourage.inputValidation)
    .mutation(updateBeneficiaryEntourage.handler),
  saveDraft: protectedProcedure
    .input(saveDraft.inputValidation)
    .mutation(saveDraft.handler),
  updateEntourage: protectedProcedure
    .input(updateEntourage.inputValidation)
    .mutation(updateEntourage.handler)
})
