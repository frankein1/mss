import { z } from 'zod'
import {
  maxStringLengthMessage,
  minStringLengthMessage,
  validNumber,
  validEmailMessage,
  requiredErrorMessage,
  errorMessages
} from '~/utils/zod'

export const paginatedSchema = z.object({
  page: z.number().int().gte(1),
  perPage: z.number().int().gte(5)
})

export const optionalPaginatedSchema = z.object({
  page: z.number().nullish(),
  perPage: z.number().nullish()
})

export type PaginatedInput = z.infer<typeof paginatedSchema>

export const idSchema = z.object({
  id: z.string().uuid()
})

export type IdInput = z.infer<typeof idSchema>

export const keySchema = z.object({
  key: z.string()
})

export const emptySchema = z.undefined()

export const numeroPegaseContraint = z
  .string()
  .regex(
    /^A-(\d){2}-(\d){6}$/,
    'Le numéro Pégase doit être de la forme A-00-000000.'
  )

export const stringConstraint = z.string(errorMessages).trim()

export const requiredStringConstraint = stringConstraint.min(
  2,
  'Veuillez renseigner ce champ.'
)

export const cafNumberConstraint = stringConstraint.max(
  8,
  maxStringLengthMessage(8)
)

export const unemploymentNumberConstraint = stringConstraint
  .min(7, minStringLengthMessage(7))
  .max(50, maxStringLengthMessage(50))

export const siretConstraint = stringConstraint
  .min(14, minStringLengthMessage(14))
  .max(30, maxStringLengthMessage(30))

export const socialSecurityNumberConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide.'
  )

export const phoneConstraint = stringConstraint.regex(
  /(^(\+33|0) ?[1-9]( ?\d){8}$)|(^(\+\d\d(?<!\+33)) ?[1-9]( ?\d){6,14}$)/,
  'Veuillez renseigner un numéro de téléphone valide.'
)

export const stringOrEmpty = (schema: z.ZodString) =>
  schema.nullish().or(z.literal(''))

export const emailOrEmpty = () =>
  stringOrEmpty(z.string().email(validEmailMessage))

export const requiredNativeEnum = <T extends z.EnumLike>(nativeEnum: T) =>
  z.nativeEnum(nativeEnum, { required_error: requiredErrorMessage })

export const withEmptyValueOptionalNativeEnum = <T extends z.EnumLike>(
  nativeEnum: T
) =>
  z.preprocess(
    arg => (arg === '' ? null : arg),
    z.nativeEnum(nativeEnum).nullish()
  )

export const kindOfBooleanSchema = (required = false) => {
  if (required) {
    return z.enum(['true', 'false'], { required_error: requiredErrorMessage })
  }

  return z.preprocess(
    arg => (arg === '' ? null : arg),
    z.enum(['true', 'false']).nullish()
  )
}

export const amountNumber = z.preprocess(
  v => (typeof v === 'string' ? v.replace(',', '.') : v),
  z.coerce
    .number({ invalid_type_error: validNumber })
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
)

export const dateOrEmpty = z.coerce
  .date()
  .nullish()
  .refine(date => !date || date.getFullYear() <= 9999, {
    message: 'Année non conforme'
  })

export const openText = (maxLength: number) =>
  stringConstraint
    .max(maxLength, maxStringLengthMessage(maxLength))
    .refine(
      v => !v.includes('<') && !v.includes('>'),
      'Les caractères spéciaux < et > ne sont pas acceptés.'
    )

export const beneficiaryIdSchema = z.object({
  beneficiaryId: z.string().uuid()
})

export type BeneficiaryIdInput = z.infer<typeof beneficiaryIdSchema>
