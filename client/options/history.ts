import { SocialSupportType } from '@prisma/client'
import { helpRequestStatusLabels } from './helpRequest'
import { followupStatusLabels } from './followup'
import { labelsToOptions } from '~/utils/options'
import type { FieldLabels } from '~/types/fieldLabels'

export const typeSuiviLabels: FieldLabels<typeof SocialSupportType> = {
  [SocialSupportType.Followup]: "Synthèse d'entretien",
  [SocialSupportType.HelpRequest]: 'Instruction de dossier',
  [SocialSupportType.HelpRequestHousing]: "Demande d'hébergement"
}

export const typeSuiviOptions = labelsToOptions(typeSuiviLabels)

export const socialSupportStatusLabels = {
  ...followupStatusLabels,
  ...helpRequestStatusLabels
}
