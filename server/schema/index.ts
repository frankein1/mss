export { createBeneficiarySchema } from './beneficiary.schema'
export type { BeneficiaryCreationInput } from './beneficiary.schema'

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

export { createFollowupTypeSchema } from './followupType.schema'
export type { CreateFollowupTypeInput } from './followupType.schema'

export { createStructureSchema, editStructureSchema } from './structure.schema'
export type {
  CreateStructureInput,
  EditStructureInput
} from './structure.schema'

export { accessTokenSchema } from './auth.schema'
export type { AccessTokenInput } from './auth.schema'
