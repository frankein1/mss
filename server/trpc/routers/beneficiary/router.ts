import { createMutation, createQuery } from '../../request/createRequest'
import { protectedProcedure, router } from '../..'
import { createBeneficiarySecurityCheck } from '../../controller/beneficiary/create.controller'
import { deleteBeneficiarySecurityCheck } from '../../controller/beneficiary/delete.controller'
import { searchBeneficiarySecurityCheck } from '../../controller/beneficiary/search.controller'
import { isBeneficiaryReferentSecurityCheck } from '../../controller/beneficiary/is-beneficiary-referent.controller'
import { getBeneficiaryMinimalInfoSecurityCheck } from '../../controller/beneficiary/get-minimal-info.controller'
import { getBeneficiarySecurityTargetSecurityCheck } from '../../controller/beneficiary/get-security-target.controller'
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
  saveDraftHandler,
  saveDraftSecurityCheck,
  updateBeneficiaryTaxHouseholdSecurityCheck,
  updateBeneficiaryGeneralInformationSecurityCheck,
  updateBeneficiaryEntourageSecurityCheck,
  updateBeneficiaryHealthSecurityCheck,
  updateBeneficiaryOccupationIncomeSecurityCheck,
  updateBeneficiaryExternalOrganisationsSecurityCheck,
  getBeneficiaryDetailsSecurityCheck,
  getBeneficiaryDocumentsSecurityCheck,
  getBeneficiaryHistorySecurityCheck,
  getBeneficiariesSecurityCheck,
  exportBeneficiariesSecurityCheck,
  getBeneficiaryFollowupTypesSecurityCheck
} from '~/server/trpc/controller/beneficiary'

// MUTATION

const saveDraft = createMutation({
  path: 'saveDraft',
  inputValidation: saveDraftSchema,
  securityCheck: saveDraftSecurityCheck,
  handler: saveDraftHandler
})

const create = createMutation({
  path: 'create',
  inputValidation: createBeneficiarySchema,
  securityCheck: createBeneficiarySecurityCheck,
  handler: createBeneficiaryHandler
})
const updateGeneralInformation = createMutation({
  path: 'updateGeneralInformation',
  inputValidation: updateBeneficiaryGeneralInformationSchema,
  securityCheck: updateBeneficiaryGeneralInformationSecurityCheck,
  handler: updateBeneficiaryGeneralInformationHandler
})
const updateTaxHousehold = createMutation({
  path: 'updateTaxHousehold',
  inputValidation: updateBeneficiaryTaxHouseholdSchema,
  securityCheck: updateBeneficiaryTaxHouseholdSecurityCheck,
  handler: updateBeneficiaryTaxHouseholdHandler
})

const updateEntourage = createMutation({
  path: 'updateEntourage',
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck: updateBeneficiaryEntourageSecurityCheck,
  handler: updateBeneficiaryEntourageHandler
})

const updateHealth = createMutation({
  path: 'updateHealth',
  inputValidation: updateBeneficiaryHealthSchema,
  securityCheck: updateBeneficiaryHealthSecurityCheck,
  handler: updateBeneficiaryHealthHandler
})

const updateOccupationIncome = createMutation({
  path: 'updateOccupationIncome',
  inputValidation: updateBeneficiaryOccupationSchema,
  securityCheck: updateBeneficiaryOccupationIncomeSecurityCheck,
  handler: updateBeneficiaryOccupationIncomeHandler
})

const updateExternalOrganisations = createMutation({
  path: 'updateExternalOrganisations',
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck: updateBeneficiaryExternalOrganisationsSecurityCheck,
  handler: updateBeneficiaryExternalOrganisationsHandler
})

const deleteMutation = createMutation({
  path: 'delete',
  inputValidation: idSchema,
  securityCheck: deleteBeneficiarySecurityCheck,
  handler: deleteBeneficiaryHandler
})

// QUERY
const search = createQuery({
  path: 'search',
  inputValidation: searchBeneficiarySchema,
  securityCheck: searchBeneficiarySecurityCheck,
  handler: searchBeneficiaryHandler
})

const isBeneficiaryReferent = createQuery({
  path: 'isBeneficiaryReferent',
  inputValidation: idSchema,
  securityCheck: isBeneficiaryReferentSecurityCheck,
  handler: isBeneficiaryReferentHandler
})
const getBeneficiaryMinimalInfo = createQuery({
  path: 'getBeneficiaryMinimalInfo',
  inputValidation: idSchema,
  securityCheck: getBeneficiaryMinimalInfoSecurityCheck,
  handler: getBeneficiaryMinimalInfoHandler
})
const getBeneficiaryDetails = createQuery({
  path: 'getBeneficiaryDetails',
  inputValidation: idSchema,
  securityCheck: getBeneficiaryDetailsSecurityCheck,
  handler: getBeneficiaryDetailsHandler
})
const getBeneficiarySecurityTarget = createQuery({
  path: 'getBeneficiarySecurityTarget',
  inputValidation: idSchema,
  securityCheck: getBeneficiarySecurityTargetSecurityCheck,
  handler: getBeneficiarySecurityTargetHandler
})
const getBeneficiaryDocuments = createQuery({
  path: 'getBeneficiaryDocuments',
  inputValidation: getDocumentsSchema,
  securityCheck: getBeneficiaryDocumentsSecurityCheck,
  handler: getBeneficiaryDocumentsHandler
})
const getBeneficiaryHistory = createQuery({
  path: 'getBeneficiaryHistory',
  inputValidation: getHistorySchema,
  securityCheck: getBeneficiaryHistorySecurityCheck,
  handler: getBeneficiaryHistoryHandler
})
const getBeneficiaries = createQuery({
  path: 'getBeneficiaries',
  inputValidation: getBeneficiariesSchema,
  securityCheck: getBeneficiariesSecurityCheck,
  handler: getBeneficiariesHandler
})
const exportBeneficiaries = createQuery({
  path: 'exportBeneficiaries',
  inputValidation: exportBeneficiariesSchema,
  securityCheck: exportBeneficiariesSecurityCheck,
  handler: exportBeneficiariesHandler
})

const getBeneficiaryFollowupTypes = createQuery({
  path: 'getBeneficiaryFollowupTypes',
  inputValidation: idSchema,
  securityCheck: getBeneficiaryFollowupTypesSecurityCheck,
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
  updateTaxHousehold: protectedProcedure
    .input(updateTaxHousehold.inputValidation)
    .mutation(updateTaxHousehold.execute),
  updateEntourage: protectedProcedure
    .input(updateEntourage.inputValidation)
    .mutation(updateEntourage.execute),
  updateHealth: protectedProcedure
    .input(updateHealth.inputValidation)
    .mutation(updateHealth.execute),
  updateOccupationIncome: protectedProcedure
    .input(updateOccupationIncome.inputValidation)
    .mutation(updateOccupationIncome.execute),
  updateExternalOrganisations: protectedProcedure
    .input(updateExternalOrganisations.inputValidation)
    .mutation(updateExternalOrganisations.execute),
  create: protectedProcedure
    .input(create.inputValidation)
    .mutation(create.execute),
  saveDraft: protectedProcedure
    .input(saveDraft.inputValidation)
    .mutation(saveDraft.execute)
})
