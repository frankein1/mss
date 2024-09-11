import { stringConstraint, stringOrEmpty } from '../helpers.schema'
import { minStringLengthMessage, maxStringLengthMessage } from '~/utils/zod'

const beneficiaryLastNameSchema = stringConstraint
  .min(2, minStringLengthMessage(2))
  .max(50, maxStringLengthMessage(50))
  .toUpperCase()

const beneficiaryLastNameOrEmptySchema = stringOrEmpty(
  beneficiaryLastNameSchema
)

export { beneficiaryLastNameSchema, beneficiaryLastNameOrEmptySchema }
