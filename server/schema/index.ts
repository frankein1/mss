import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case 'invalid_date':
      return { message: 'Veuillez saisir une date valide : JJ/MM/AAAA.' }
    case 'invalid_enum_value':
      return { message: 'Veuillez sélectionner une option proposée.' }
    default:
      return { message: ctx.defaultError }
  }
}

z.setErrorMap(customErrorMap)

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

export { addCommentSchema, editCommentSchema } from './comment.schema'
export type { AddCommentInput, EditCommentInput } from './comment.schema'
