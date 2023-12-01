import { labelsToOptions } from '~/utils/options'
import type { FieldLabels } from '~/types/fieldLabels'
import { TypeSuivi } from '~/types/history'

export const typeSuiviLabels: FieldLabels<typeof TypeSuivi> = {
  [TypeSuivi.Followup]: "Synthèse d'entretien",
  [TypeSuivi.HelpRequest]: 'Instruction de dossier'
}

export const typeSuiviOptions = labelsToOptions(typeSuiviLabels)
