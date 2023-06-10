import { z } from 'zod'

export const idSchema = z.object({
  id: z.string()
})

export const keySchema = z.object({
  key: z.string()
})

export {
  createBeneficiarySchema,
  searchBeneficiarySchema,
  updateBeneficiarySchema,
  getBeneficiariesSchema,
  getDocumentsSchema,
  getHistorySchema
} from './beneficiary.schema'
export type {
  CreateBeneficiaryInput,
  SearchBeneficiaryInput,
  UpdateBeneficiaryInput,
  GetBeneficiariesInput,
  GetDocumentsInput,
  GetHistoryInput
} from './beneficiary.schema'

export {
  addFollowupSchema,
  editFollowupSchema,
  getFollowupsSchema,
  quickEditFollowupSchema
} from './followup.schema'
export type {
  AddFollowupInput,
  EditFollowupInput,
  GetFollowupsInput,
  QuickEditFollowupInput
} from './followup.schema'

export {
  createHelpRequestSchema,
  quickEditHelpRequestSchema,
  getHelpRequestsSchema,
  quickEditHelpRequestStatusSchema,
  quickEditHelpRequestAllocatedAmountSchema,
  quickEditHelpRequestPaymentMethodSchema,
  quickEditHelpRequestPaymentDateSchema,
  editHelpRequestSchema
} from './helpRequest.schema'
export type {
  CreateHelpRequestInput,
  QuickEditHelpRequestInput,
  GetHelpRequestsInput,
  QuickEditHelpRequestStatusInput,
  QuickEditHelpRequestAllocatedAmountInput,
  QuickEditHelpRequestPaymentMethodInput,
  QuickEditHelpRequestPaymentDateInput,
  EditHelpRequestInput,
  GetHelpRequestsInputOrderBy
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

export {
  updateNotificationSchema,
  getNotificationSchema
} from './notification.schema'
export type {
  UpdateNotificationInput,
  GetNotificationInput
} from './notification.schema'

export {
  addDocumentSchema,
  editDocumentSchema,
  deleteDocumentSchema,
  createUploadUrlSchema,
  createViewUrlSchema,
  uploadBrowserDocumentSchema
} from './document.schema'
export type {
  AddDocumentInput,
  EditDocumentInput,
  DeleteDocumentInput,
  CreateUploadUrlInput,
  CreateViewUrlInput,
  UploadBrowserDocumentInput
} from './document.schema'

export { addCommentSchema } from './comment.schema'
export type { AddCommentInput } from './comment.schema'
