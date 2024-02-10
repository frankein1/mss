import {
  FileInstructionReason,
  FileInstructionRefusalReason
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const housingHelpRequestReasonLabels = {
  [FileInstructionReason.Violences]: 'Violences',
  [FileInstructionReason.DivorceSeparation]: 'Divorce ou séparation',
  [FileInstructionReason.RapprochementFamilial]: 'Rapprochement familial',
  [FileInstructionReason.Mutation]: 'Mutation',
  [FileInstructionReason.Expulsion]: 'Expulsion',
  [FileInstructionReason.LogementInsalubre]: 'Logement insalubre',
  [FileInstructionReason.LogementNonDecent]: 'Logement non décent',
  [FileInstructionReason.LogementReprisVente]:
    'Logement repris ou mis en vente',
  [FileInstructionReason.LogementInadapte]: 'Logement inadapté',
  [FileInstructionReason.LogementTropCher]: 'Logement trop cher',
  [FileInstructionReason.LogementBientotDemoli]: 'Logement bientôt démoli',
  [FileInstructionReason.Localisation]: 'Localisation du logement',
  [FileInstructionReason.SansLogementOuTemporaire]:
    'Sans logement ou logement temporaire'
}

export const helpRequestReasonLabels = {
  [FileInstructionReason.Violences]: 'Violences',
  [FileInstructionReason.Housing]: 'Hébergemnent',
  [FileInstructionReason.Food]: 'Alimentation',
  [FileInstructionReason.Energy]: 'Energie',
  [FileInstructionReason.Other]: 'Autre'
}

export const fileInstructionReasonLabels = {
  ...helpRequestReasonLabels,
  ...housingHelpRequestReasonLabels
}

export const helpRequestReasonOptions = labelsToOptions(helpRequestReasonLabels)
export const housingHelpRequestReasonOptions = labelsToOptions(
  housingHelpRequestReasonLabels
)

export const reasonLabels = {
  ...housingHelpRequestReasonLabels,
  ...helpRequestReasonLabels
}

export const reasonOptions = labelsToOptions(reasonLabels)

const baseRefusalReasonLabels = {
  [FileInstructionRefusalReason.ResourcesOutOfScale]: 'Ressources hors barème',
  [FileInstructionRefusalReason.ShortDeadline]: 'Délai trop court',
  [FileInstructionRefusalReason.IncompleteFile]: 'Dossier incomplet',
  [FileInstructionRefusalReason.IrregularSituation]: 'En situation irrégulière'
}

export const helpRequestRefusalReasonLabels = {
  ...baseRefusalReasonLabels,
  [FileInstructionRefusalReason.MissedAppointment]: 'Absence au rendez-vous',
  [FileInstructionRefusalReason.AlreadyExistingHelpRequest]:
    "Instruction déjà en cours auprès d'un autre organisme",
  [FileInstructionRefusalReason.Reoriented]:
    "Réorientation auprès d'un autre organisme",
  [FileInstructionRefusalReason.Debt]: 'Endettement',
  [FileInstructionRefusalReason.Other]: 'Autre'
}

const housingFileInstructionRefusalReasonLabels = {
  ...baseRefusalReasonLabels,
  [FileInstructionRefusalReason.InadequateFamilyComposition]:
    'Composition familiale inadaptée au type de logement',
  [FileInstructionRefusalReason.ExpiredRequest]: 'Demande expirée',
  [FileInstructionRefusalReason.Other]: 'Autre'
}

export const fileInstructionRefusalReasonLabels = {
  ...helpRequestRefusalReasonLabels,
  ...housingFileInstructionRefusalReasonLabels
}

export const helpRequestRefusalReasonOptions = labelsToOptions(
  helpRequestRefusalReasonLabels
)

export const housingFileInstructionRefusalReasonOptions = labelsToOptions(
  housingFileInstructionRefusalReasonLabels
)
