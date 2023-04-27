import { Options } from '~/utils/options'

export const zodEnumFromOptions = (options: Options): [string, ...string[]] =>
  Array.from(options).map(([value]) => value) as [string, ...string[]]

export const zodEnumFromObjectKeys = <T extends object>(
  object: T
): [keyof T, ...(keyof T)[]] => Object.keys(object) as [keyof T, ...(keyof T)[]]

export const errorMessages = {
  required_error: 'Veuillez renseigner ce champ',
  invalid_type_error: 'Cette valeur est incorrecte'
}

export const minStringLengthMessage = (length: number) =>
  `Veuillez renseigner au minimum ${length} caractère${length > 1 ? 's' : ''}`

export const validEmailMessage = 'Veuillez renseigner un email valide'
