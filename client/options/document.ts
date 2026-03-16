import { DocumentType } from '@prisma/client'
import { MAX_UPLOAD_SIZE_BYTES } from '~/utils/constants'
import { buildKeys } from '~/utils/keys/keyBuilder'

// Max size in bytes
export const documentFileMaxSize = MAX_UPLOAD_SIZE_BYTES
export const documentFileAllowedTypes = [
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
]
export const viewableInBrowserTypes = [
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const documentTypeKeys = buildKeys({
  [DocumentType.Cerfa]: 'CERFA',
  [DocumentType.HistoriqueCourrier]: 'Historique Courrier',
  [DocumentType.Justificatifs]: 'Justificatifs',
  [DocumentType.Rapports]: 'Rapports'
})

export const documentTypeIcons: Record<DocumentType, string> = {
  [DocumentType.Cerfa]: 'fr-icon-survey-line',
  [DocumentType.HistoriqueCourrier]: 'fr-icon-mail-line',
  [DocumentType.Justificatifs]: 'fr-icon-file-text-line',
  [DocumentType.Rapports]: 'fr-icon-article-line'
}

export const documentTagKeys = buildKeys({
  BudgetRessources: 'Budget-Ressources',
  Emploi: 'Emploi',
  Impot: 'Impôt',
  Justice: 'Justice',
  Logement: 'Logement',
  MaintienADomicile: 'Maintien à domicile',
  PrestationsSociales: 'Prestations sociales',
  Retraite: 'Retraite',
  SanteHandicap: 'Santé-Handicap',
  Identite: 'Identité'
})
