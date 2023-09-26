import { z } from 'zod'
import { Options } from '~/utils/options'

export const zodEnumFromOptions = (options: Options): [string, ...string[]] =>
  Array.from(options).map(([value]) => value) as [string, ...string[]]

export const requiredErrorMessage = 'Veuillez renseigner ce champ.'

export const errorMessages = {
  required_error: requiredErrorMessage,
  invalid_type_error: 'Cette valeur est incorrecte.'
}

export const minStringLengthMessage = (length: number) =>
  `Veuillez renseigner au minimum ${length} caractère${length > 1 ? 's' : ''}.`

export const validEmailMessage = 'Veuillez renseigner un email valide.'

export const validZipcode = 'Veuillez renseigner un code postal valide.'

export const validNumber =
  'Veuillez saisir un nombre valide. Format attendu : 123, 123,45 ou 123.45.'

export const validIntNumber = 'Veuillez entrer un nombre entier.'

export const amountNumber = z.preprocess(
  v => (typeof v === 'string' ? v.replace(',', '.') : v),
  z.coerce
    .number({ invalid_type_error: validNumber })
    .gte(0, 'Veuillez entrer un nombre supérieur ou égal à 0.')
)

export const enumErrorMap: z.ZodErrorMap = issue => {
  switch (issue.code) {
    case 'invalid_enum_value':
    case 'invalid_type':
      return { message: 'Veuillez sélectionner une valeur.' }
    default:
      return { message: errorMessages.invalid_type_error }
  }
}

export const kindOfBooleanSchema = () =>
  z.enum(['true', 'false'], {
    errorMap: enumErrorMap
  })

export const requiredNativeEnum = <T extends z.EnumLike>(nativeEnum: T) =>
  z.nativeEnum(nativeEnum, { errorMap: enumErrorMap })

export const withEmptyValueOptionalNativeEnum = <T extends z.EnumLike>(
  nativeEnum: T
) =>
  z.preprocess(
    arg => (arg === '' ? null : arg),
    z.nativeEnum(nativeEnum, { errorMap: enumErrorMap }).nullish()
  )

export const stringOrEmpty = (schema: z.ZodString) =>
  schema.nullish().or(z.literal(''))

export const emailOrEmpty = () =>
  stringOrEmpty(z.string().email('Email non valide'))
