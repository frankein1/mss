import {
  FileInstructionRefusalReason,
  FileInstructionType
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

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

export const fileInstructionTypeLabels: {
  [key in FileInstructionType]: string
} = {
  [FileInstructionType.Housing]: 'Une demande de logement',
  [FileInstructionType.Financial]: 'Une aide financière',
  [FileInstructionType.Other]: 'Autre'
}

export const fileInstructionTypeOptions = labelsToOptions(
  fileInstructionTypeLabels
)

export const fileInstructionTypeFilterLabels: {
  [key in FileInstructionType]: string
} = {
  [FileInstructionType.Housing]: 'Demande de logement',
  [FileInstructionType.Financial]: 'Aide financière',
  [FileInstructionType.Other]: 'Autre'
}

export const fileInstructionTypeFilterOptions = labelsToOptions(
  fileInstructionTypeFilterLabels
)

// As pictograms are used as variables, they have to be in the public directory. - See https://www.lichter.io/articles/nuxt3-vue3-dynamic-images/
export const fileInstructionTypePictos: {
  [key in FileInstructionType]: string
} = {
  [FileInstructionType.Housing]: '/pictograms/building.svg',
  [FileInstructionType.Financial]: '/pictograms/tax-stamp.svg',
  [FileInstructionType.Other]: '/pictograms/document.svg'
}
