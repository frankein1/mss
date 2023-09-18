import { z } from 'zod'

export const idSchema = z.object({
  id: z.string()
})

export const keySchema = z.object({
  key: z.string()
})

export { paginatedSchema } from './helpers.schema'
export type { PaginatedInput } from './helpers.schema'

export {
  addFollowupSchema,
  editFollowupSchema,
  exportFollowupsSchema,
  getFollowupsSchema,
  quickEditFollowupSchema
} from './followup.schema'
export type {
  AddFollowupInput,
  EditFollowupInput,
  ExportFollowupsInput,
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
  editHelpRequestSchema,
  exportHelpRequestsSchema
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
  GetHelpRequestsInputOrderBy,
  ExportHelpRequestsInput
} from './helpRequest.schema'

export {
  createFollowupTypeSchema,
  createCustomFollowupTypeSchema
} from './followupType.schema'
export type {
  CreateFollowupTypeInput,
  CreateCustomFollowupTypeInput
} from './followupType.schema'

export * from './user'
export * from './structure'
export * from './auth'

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

export * from './beneficiary'

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
