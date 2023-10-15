export * from './beneficiary'
export * from './beneficiaryDraft'
export * from './followup'
export * from './user'
export * from './structure'
export * from './auth'
export * from './helpRequest'
export * from './helpers.schema'

export {
  createFollowupTypeSchema,
  createCustomFollowupTypeSchema
} from './followupType.schema'
export type {
  CreateFollowupTypeInput,
  CreateCustomFollowupTypeInput
} from './followupType.schema'

export {
  statFilterSchema,
  beneficiaryFilterSchema,
  followupFilterSchema,
  helpRequestFilterSchema,
  beneficiaryHistoryFilterSchema,
  userAdminFilterSchema,
  beneficiaryDocumentFilterSchema
} from './filter.schema'
export type {
  StatFilterInput,
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput,
  BeneficiaryHistoryFilterInput,
  UserAdminFilterInput,
  BeneficiaryDocumentFilterInput
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
