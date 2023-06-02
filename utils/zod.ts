import { z } from 'zod'
import { Options } from '~/utils/options'

export const zodEnumFromOptions = (options: Options): [string, ...string[]] =>
  Array.from(options).map(([value]) => value) as [string, ...string[]]

export const errorMessages = {
  required_error: 'Veuillez renseigner ce champ.',
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

export const kindOfBooleanSchema = z.enum(['true', 'false'])
