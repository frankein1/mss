export const UNKNOWN_ERROR_MESSAGE = 'Une erreur est survenue.'
export const DIRECTUS_UNIQUE_EMAIL_ERROR = 'Field "email" has to be unique.'
export const SENSITIVE_DATA_HINT =
  "Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."

export const REQUEST_LIMIT_OPTIONS = new Map([
  ['5', '5'],
  ['10', '10'],
  ['15', '15'],
  ['30', '30'],
  ['60', '60']
])
export const REQUEST_LIMIT_DEFAULT = 15

export const NEW_OPTION_ID = 'new-option'
export const NEW_OPTION_PREFIX = `${NEW_OPTION_ID}-`

export const STATS_COLLAPSED_LIMIT = 4

export const ORIGIN_PAGE_PARAMETER = 'originPage'
export const ORIGIN_TAB_PARAMETER = 'originTab'

export const INPUT_DEFER_TIME = 400
