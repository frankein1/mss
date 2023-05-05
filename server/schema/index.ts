export {
  idSchema,
  createBeneficiarySchema,
  searchBeneficiarySchema
} from './beneficiary.schema'
export type {
  BeneficiaryCreationInput,
  SearchBeneficiaryInput
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
  CreateCustomFollowupTypeInput,
  FollowupTypeWithSupportsCount
} from './followupType.schema'

export { editCurrentUserStructureSchema } from './structure.schema'
export type { EditCurrentUserStructureInput } from './structure.schema'

export { accessTokenSchema } from './auth.schema'
export type { AccessTokenInput } from './auth.schema'

export { createUserSchema, editUserSchema } from './user.schema'
export type { UserCreationInput, UserEditionInput } from './user.schema'

export { statFilterSchema } from './filter.schema'
export type { StatFilterInput } from './filter.schema'
