import { Options } from '~/utils/options'

export const zodEnumFromOptions = (options: Options): [string, ...string[]] =>
  Array.from(options).map(o => o.value) as [string, ...string[]]

export const requiredErrorMessage = 'Veuillez renseigner ce champ.'

export const errorMessages = {
  error: (issue: { input: unknown }) =>
    issue.input === undefined
      ? requiredErrorMessage
      : 'Cette valeur est incorrecte.'
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

export const validYear = 'Veuillez renseigner une année valide.'
export const validDate = 'Veuillez renseigner une date valide.'

export const validEnum = 'Veuillez sélectionner une option proposée.'
