export const requiredErrorMessage = 'Veuillez renseigner ce champ.'
export const invalidTypeErrorMessage = 'Cette valeur est incorrecte.'

export const errorMessages = {
  required_error: requiredErrorMessage,
  invalid_type_error: invalidTypeErrorMessage
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
export const validDate = 'Veuillez saisir une date valide : JJ/MM/AAAA.'
export const validSelectionMessage =
  'Veuillez sélectionner une option proposée.'
export const validUrlMessage = 'Veuillez renseigner une URL valide.'
export const invalidValueMessage = 'Cette valeur est incorrecte.'
