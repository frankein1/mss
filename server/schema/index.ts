export {
  idSchema,
  createBeneficiarySchema,
  searchBeneficiarySchema,
  updateBeneficiarySchema,
  getBeneficiariesSchema
} from './beneficiary.schema'
export type {
  BeneficiaryCreationInput,
  SearchBeneficiaryInput,
  UpdateBeneficiaryInput,
  GetBeneficiariesInput
} from './beneficiary.schema'

export {
  addFollowupSchema,
  editFollowupSchema,
  getFollowupsSchema,
  editFollowupStatusSchema
} from './followup.schema'
export type {
  AddFollowupInput,
  EditFollowupInput,
  GetFollowupsInput,
  EditFollowupStatusInput
} from './followup.schema'

export {
  // createHelpRequestSchema,
  editHelpRequestSchema,
  getHelpRequestsSchema,
  editHelpRequestStatusSchema,
  editHelpRequestAllocatedAmountSchema,
  editHelpRequestPaymentMethodSchema,
  editHelpRequestPaymentDateSchema
} from './helpRequest.schema'
export type {
  // CreateHelpRequestInput,
  EditHelpRequestInput,
  GetHelpRequestsInput,
  EditHelpRequestStatusInput,
  EditHelpRequestAllocatedAmountInput,
  EditHelpRequestPaymentMethodInput,
  EditHelpRequestPaymentDateInput
} from './helpRequest.schema'

export {
  createFollowupTypeSchema,
  createCustomFollowupTypeSchema
} from './followupType.schema'
export type {
  CreateFollowupTypeInput,
  CreateCustomFollowupTypeInput
} from './followupType.schema'

export { editCurrentUserStructureSchema } from './structure.schema'
export type { EditCurrentUserStructureInput } from './structure.schema'

export { accessTokenSchema } from './auth.schema'
export type { AccessTokenInput } from './auth.schema'

export {
  createUserSchema,
  editUserSchema,
  editUserRoleSchema,
  editUserAidantConnectAuthorisationSchema,
  editUserStatusSchema
} from './user.schema'
export type {
  UserCreationInput,
  UserEditionInput,
  UserRoleEditionInput,
  UserAidantConnectAuthorisationEditionInput,
  UserStatusEditionInput
} from './user.schema'

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  helpRequestFilterSchema,
  beneficiaryHistoryFilterSchema
} from './filter.schema'
export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput,
  BeneficiaryHistoryFilterInput
} from './filter.schema'

export {
  createOrUpdateEntourageSchema,
  createOrUpdateTaxHouseholdSchema
} from './relative.schema'
export type {
  CreateOrUpdateEntourageInput,
  CreateOrUpdateTaxHouseholdInput
} from './relative.schema'
