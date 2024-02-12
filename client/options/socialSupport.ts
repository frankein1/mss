import { SocialSupportStatus } from '@prisma/client'
import { followupStatusLabels } from './followup'
import { FieldLabels } from '~/types/fieldLabels'

export enum TypeSuivi {
  Followup = 'Followup',
  AllHelpRequest = 'AllHelpRequest',
  HousingHelpRequest = 'HousingHelpRequest',
  FinancialHelpRequest = 'FinancialHelpRequest',
  OtherHelpRequest = 'OtherHelpRequest'
}

const typeSuiviLabels: FieldLabels<typeof TypeSuivi> = {
  [TypeSuivi.Followup]: "Synthèses d'entretiens",
  [TypeSuivi.AllHelpRequest]: 'Instructions - toutes',
  [TypeSuivi.HousingHelpRequest]: 'Instructions - demande de logement',
  [TypeSuivi.FinancialHelpRequest]: 'Instructions - aide financière',
  [TypeSuivi.OtherHelpRequest]: 'Instructions - autre'
}

export const typeSuiviOptions = labelsToOptions(typeSuiviLabels)

export const fileInstructionLabelsStatusLabels = {
  [SocialSupportStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [SocialSupportStatus.InvestigationOngoing]: "En cours d'instruction",
  [SocialSupportStatus.Accepted]: 'Accepté',
  [SocialSupportStatus.Refused]: 'Refusé',
  [SocialSupportStatus.Adjourned]: 'Ajourné',
  [SocialSupportStatus.ClosedByBeneficiary]: 'Clôturé par le bénéficiaire',
  [SocialSupportStatus.ClosedByAgent]: "Clôturé par l'agent",
  [SocialSupportStatus.Dismissed]: 'Classé sans suite'
}

export const ministrySocialSupportStatusLabels = {
  ...fileInstructionLabelsStatusLabels,
  [SocialSupportStatus.Accepted]: 'Traité'
}

export const socialSupportStatusLabels = {
  ...followupStatusLabels,
  ...fileInstructionLabelsStatusLabels
}
