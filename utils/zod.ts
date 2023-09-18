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

export const wordConstraint = (length?: number) =>
  z
    .string()
    .max(length || 50, `${length || 50} caractères maximum`)
    .regex(
      /^[A-zÀ-ú1-9\s]*[-'s]?[A-zÀ-ú1-9\s]*$/,
      'ne peut contenir que des lettres, des espaces ou -'
    )
    .trim()

export const phoneConstraint = z
  .string()
  .regex(
    /^(\+33 |0)[1-9]( \d\d){4}$/,
    'le format doit être de la forme 00 00 00 00 00'
  )
  .min(10, '10 caractères minimum')
  .max(20, '20 caractères maximum')

export const socialSecurityNumberConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )

export const siretConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )

export const unemploymentNumberConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )

export const cafNumberConstraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )

export const numeroPegaseContraint = z
  .string()
  .regex(
    /^([12] \d{2} (0[1-9]|1[0-2]) (2[AB]|\d{2}) \d{3} \d{3})( \d{2})?$|^$/,
    'Veuillez entrer un numéro de sécurité sociale valide'
  )
