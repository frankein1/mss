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

export const maxStringLengthMessage = (length: number) =>
  `Veuillez renseigner au maximum ${length} caractères.`

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
  stringOrEmpty(z.string().email(validEmailMessage))

export const stringConstraint = z.string().trim()

export const phoneConstraint = stringConstraint.regex(
  /^(\+33 |0)[1-9]( \d\d){4}$/,
  'Le format doit être de la forme 01 22 33 44 55'
)

export const socialSecurityNumberConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )

export const siretConstraint = stringConstraint
  .min(14, minStringLengthMessage(14))
  .max(30, maxStringLengthMessage(30))

export const unemploymentNumberConstraint = stringConstraint
  .min(7, minStringLengthMessage(7))
  .max(50, maxStringLengthMessage(50))

export const cafNumberConstraint = stringConstraint.max(
  8,
  maxStringLengthMessage(8)
)

export const numeroPegaseContraint = z
  .string()
  .regex(
    /^A-(\d){2}-(\d){6}$/,
    'Le numéro Pegase doit être de la forme A-00-000000'
  )
