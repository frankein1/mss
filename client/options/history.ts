import { helpRequestStatusLabels } from './helpRequest'
import { followupStatusLabels } from './followup'
import { labelsToOptions } from '~/utils/options'
import type { FieldLabels } from '~/types/fieldLabels'

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

export const socialSupportStatusLabels = {
  ...followupStatusLabels,
  ...helpRequestStatusLabels
}
