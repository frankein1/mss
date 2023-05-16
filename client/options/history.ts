import { labelsToOptions } from '../../utils/options'

export const typeSuiviLabels: { followup: string; helpRequest: string } = {
  followup: "Synthèse d'entretien",
  helpRequest: "Demande d'aide"
}

export const typeSuiviOptions = labelsToOptions(typeSuiviLabels)
