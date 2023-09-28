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
  updateBeneficiaryHealthSchema,
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
  updateBeneficiaryHealthHandler,
  saveDraftHandler
} from '~/server/trpc/controller/beneficiary'
import { AllowSecurityCheck } from '~/server/security/rules/types'

// MUTATION

const saveDraft = createMutation({
  path: 'saveDraft',
  inputValidation: saveDraftSchema,
  securityCheck: AllowSecurityCheck,
  handler: saveDraftHandler
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

const updateEntourage = createMutation({
  path: 'updateEntourage',
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryEntourageHandler
})

const updateHealth = createMutation({
  path: 'updateHealth',
  inputValidation: updateBeneficiaryHealthSchema,
  securityCheck: AllowSecurityCheck,
  handler: updateBeneficiaryHealthHandler
})

const deleteMutation = createMutation({
  path: 'delete',
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler: deleteBeneficiaryHandler
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
    .query(isBeneficiaryReferent.execute),
  getBeneficiaryMinimalInfo: protectedProcedure
    .input(getBeneficiaryMinimalInfo.inputValidation)
    .query(getBeneficiaryMinimalInfo.execute),
  getBeneficiaryDetails: protectedProcedure
    .input(getBeneficiaryDetails.inputValidation)
    .query(getBeneficiaryDetails.execute),
  getBeneficiarySecurityTarget: protectedProcedure
    .input(getBeneficiarySecurityTarget.inputValidation)
    .query(getBeneficiarySecurityTarget.execute),
  getBeneficiaryHistory: protectedProcedure
    .input(getBeneficiaryHistory.inputValidation)
    .query(getBeneficiaryHistory.execute),
  getBeneficiaries: protectedProcedure
    .input(getBeneficiaries.inputValidation)
    .query(getBeneficiaries.execute),
  exportBeneficiaries: protectedProcedure
    .input(exportBeneficiaries.inputValidation)
    .query(exportBeneficiaries.execute),
  search: protectedProcedure
    .input(search.inputValidation)
    .query(search.execute),
  getBeneficiaryFollowupTypes: protectedProcedure
    .input(getBeneficiaryFollowupTypes.inputValidation)
    .query(getBeneficiaryFollowupTypes.execute),
  getBeneficiaryDocuments: protectedProcedure
    .input(getBeneficiaryDocuments.inputValidation)
    .query(getBeneficiaryDocuments.execute),

  delete: protectedProcedure
    .input(deleteMutation.inputValidation)
    .mutation(deleteMutation.execute),
  updateGeneralInformation: protectedProcedure
    .input(updateGeneralInformation.inputValidation)
    .mutation(updateGeneralInformation.execute),
  update: protectedProcedure
    .input(update.inputValidation)
    .mutation(update.execute),
  updateTaxHousehold: protectedProcedure
    .input(updateTaxHousehold.inputValidation)
    .mutation(updateTaxHousehold.execute),
  updateEntourage: protectedProcedure
    .input(updateEntourage.inputValidation)
    .mutation(updateEntourage.execute),
  updateHealth: protectedProcedure
    .input(updateHealth.inputValidation)
    .mutation(updateHealth.execute),
  create: protectedProcedure
    .input(create.inputValidation)
    .mutation(create.execute),
  saveDraft: protectedProcedure
    .input(saveDraft.inputValidation)
    .mutation(saveDraft.execute)
})
