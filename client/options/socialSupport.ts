import { SocialSupportStatus } from '@prisma/client'
import { followupStatusKeys } from './followup'
import { buildKeys } from '~/utils/keys/keyBuilder'

export enum TypeSuivi {
  Followup = 'Followup',
  AllHelpRequest = 'AllHelpRequest',
  HousingHelpRequest = 'HousingHelpRequest',
  FinancialHelpRequest = 'FinancialHelpRequest',
  OtherHelpRequest = 'OtherHelpRequest'
}

export const typeSuiviKeys = buildKeys({
  [TypeSuivi.Followup]: "Synthèses d'entretiens",
  [TypeSuivi.AllHelpRequest]: 'Instructions - toutes',
  [TypeSuivi.HousingHelpRequest]: 'Instructions - demande de logement',
  [TypeSuivi.FinancialHelpRequest]: 'Instructions - aide financière',
  [TypeSuivi.OtherHelpRequest]: 'Instructions - autre'
})

export const fileInstructionStatusKeys = buildKeys({
  [SocialSupportStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [SocialSupportStatus.InvestigationOngoing]: "En cours d'instruction",
  [SocialSupportStatus.Accepted]: 'Accepté',
  [SocialSupportStatus.Refused]: 'Refusé',
  [SocialSupportStatus.Adjourned]: 'Ajourné',
  [SocialSupportStatus.ClosedByBeneficiary]: 'Clôturé par le bénéficiaire',
  [SocialSupportStatus.ClosedByAgent]: "Clôturé par l'agent",
  [SocialSupportStatus.Dismissed]: 'Classé sans suite'
})

export const ministryFileInstructionStatusKeys = buildKeys({
  [SocialSupportStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [SocialSupportStatus.InvestigationOngoing]: "En cours d'instruction",
  // TODO: HANDLE LABEL IN DB
  [SocialSupportStatus.Accepted]: 'Traité',
  [SocialSupportStatus.Refused]: 'Refusé',
  [SocialSupportStatus.Adjourned]: 'Ajourné',
  [SocialSupportStatus.ClosedByBeneficiary]: 'Clôturé par le bénéficiaire',
  [SocialSupportStatus.ClosedByAgent]: "Clôturé par l'agent",
  [SocialSupportStatus.Dismissed]: 'Classé sans suite'
})

export const socialSupportStatusKeys = {
  ...followupStatusKeys,
  ...fileInstructionStatusKeys
}

export const ministrySocialSupportStatusKeys = {
  ...followupStatusKeys,
  ...ministryFileInstructionStatusKeys
}
