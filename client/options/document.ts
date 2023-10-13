import { DocumentType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'
import { DocumentTag } from '~/types/document'

// Max size in bytes
export const documentFileMaxSize = 15_000_000
export const documentFileAllowedTypes = [
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
]

export const documentTypeLabels: {
  [scope in DocumentType]: string
} = {
  [DocumentType.Cerfa]: 'CERFA',
  [DocumentType.HistoriqueCourrier]: 'Historique Courrier',
  [DocumentType.Justificatifs]: 'Justificatifs',
  [DocumentType.Rapports]: 'Rapports'
}

export const documentTypeOptions = labelsToOptions(documentTypeLabels)

export const documentTagLabels: { [scope in DocumentTag]: string } = {
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
}

export const documentTagOptions = labelsToOptions(documentTagLabels)
