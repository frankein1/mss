import { buildKeys } from '../keys/keyBuilder'

export const UNKNOWN_ERROR_MESSAGE = 'Une erreur est survenue.'
export const FAILED_DOWNLOAD_ERROR_MESSAGE = 'Le téléchargement a échoué.'
export const SENSITIVE_DATA_HINT =
  "Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."

export const REQUEST_LIMIT_KEYS = buildKeys({
  '5': '5',
  '10': '10',
  '15': '15',
  '20': '20',
  '30': '30',
  '60': '60'
})

export const REQUEST_LIMIT_DEFAULT = 20
export const BENEFICIARIES_REQUEST_LIMIT_DEFAULT = 60
export const NOTIFICATIONS_REQUEST_LIMIT_DEFAULT = 10

export const INPUT_DEFER_DURATION = 400

export const EMPTY_TABLE_CELL = '-'

export const MAX_UPLOAD_SIZE_BYTES = 20971520
