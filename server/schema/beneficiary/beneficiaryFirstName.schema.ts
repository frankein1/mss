import { z } from 'zod'
import { stringConstraint, stringOrEmpty } from '../helpers.schema'
import { maxStringLengthMessage, minStringLengthMessage } from '~/utils/zod'

const beneficiaryFirstNameBaseSchema = stringConstraint
  .min(2, minStringLengthMessage(2))
  .max(50, maxStringLengthMessage(50))

const beneficiaryFirstNameSchemaTransform = (
  schema:
    | z.ZodString
    | z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<''>]>
) =>
  schema.transform(v => {
    if (!v) {
      return v
    }
    const [firstLetter, ...rest] = v
    return `${firstLetter.toUpperCase()}${rest.join('')}`
  })

const beneficiaryFirstNameSchema = beneficiaryFirstNameSchemaTransform(
  beneficiaryFirstNameBaseSchema
)

const beneficiaryFirstNameOrEmptySchema = beneficiaryFirstNameSchemaTransform(
  stringOrEmpty(beneficiaryFirstNameBaseSchema)
)

export { beneficiaryFirstNameSchema, beneficiaryFirstNameOrEmptySchema }
