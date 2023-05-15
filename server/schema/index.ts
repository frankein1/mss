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
  UpdateBeneficiaryRawInput,
  GetBeneficiariesInput
} from './beneficiary.schema'

export { addFollowupSchema, editFollowupSchema } from './followup.schema'
export type { AddFollowupInput, EditFollowupInput } from './followup.schema'

export {
  createHelpRequestSchema,
  editHelpRequestSchema
} from './helpRequest.schema'
export type {
  CreateHelpRequestInput,
  EditHelpRequestInput
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

export { statFilterSchema, beneficiaryFilterSchema } from './filter.schema'
export type { StatFilterInput, BeneficiaryFilterInput } from './filter.schema'

export { createOrUpdateRelativeSchema } from './relative.schema'
export type { CreateOrUpdateRelativeInput } from './relative.schema'
