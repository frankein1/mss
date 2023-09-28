import {
  createQuery,
  createMutation,
  Request
} from '../../request/createRequest'
import { buildRouter } from '../../request/buildRouter'
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
  saveDraftHandler
} from '~/server/trpc/controller/beneficiary'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const requests: Request[] = [
  createQuery({
    path: 'search',
    inputValidation: searchBeneficiarySchema,
    securityCheck: AllowSecurityCheck,
    handler: searchBeneficiaryHandler
  }),
  createMutation({
    path: 'create',
    inputValidation: createBeneficiarySchema,
    securityCheck: AllowSecurityCheck,
    handler: createBeneficiaryHandler
  }),
  createMutation({
    path: 'update',
    inputValidation: updateBeneficiarySchema,
    securityCheck: AllowSecurityCheck,
    handler: updateBeneficiaryHandler
  }),
  createMutation({
    path: 'updateGeneralInformation',
    inputValidation: updateBeneficiaryGeneralInformationSchema,
    securityCheck: AllowSecurityCheck,
    handler: updateBeneficiaryGeneralInformationHandler
  }),
  createMutation({
    path: 'updateTaxHousehold',
    inputValidation: updateBeneficiaryTaxHouseholdSchema,
    securityCheck: AllowSecurityCheck,
    handler: updateBeneficiaryTaxHouseholdHandler
  }),
  createQuery({
    path: 'isBeneficiaryReferent',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: isBeneficiaryReferentHandler
  }),
  createQuery({
    path: 'getBeneficiaryMinimalInfo',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiaryMinimalInfoHandler
  }),
  createQuery({
    path: 'getBeneficiaryDetails',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiaryDetailsHandler
  }),
  createQuery({
    path: 'getBeneficiarySecurityTarget',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiarySecurityTargetHandler
  }),
  createQuery({
    path: 'getBeneficiaryDocuments',
    inputValidation: getDocumentsSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiaryDocumentsHandler
  }),
  createQuery({
    path: 'getBeneficiaryHistory',
    inputValidation: getHistorySchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiaryHistoryHandler
  }),
  createQuery({
    path: 'getBeneficiaries',
    inputValidation: getBeneficiariesSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiariesHandler
  }),
  createQuery({
    path: 'exportBeneficiaries',
    inputValidation: exportBeneficiariesSchema,
    securityCheck: AllowSecurityCheck,
    handler: exportBeneficiariesHandler
  }),
  createMutation({
    path: 'delete',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: deleteBeneficiaryHandler
  }),
  createQuery({
    path: 'getBeneficiaryFollowupTypes',
    inputValidation: idSchema,
    securityCheck: AllowSecurityCheck,
    handler: getBeneficiaryFollowupTypesHandler
  }),
  createMutation({
    path: 'saveDraft',
    inputValidation: saveDraftSchema,
    securityCheck: AllowSecurityCheck,
    handler: saveDraftHandler
  })
]

export const beneficiaryRouter = buildRouter(requests)
