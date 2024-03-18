import {
  FileInstructionRefusalReason,
  FileInstructionType
} from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

const baseRefusalReasonKeys = buildKeys({
  [FileInstructionRefusalReason.ResourcesOutOfScale]: 'Ressources hors barème',
  [FileInstructionRefusalReason.ShortDeadline]: 'Délai trop court',
  [FileInstructionRefusalReason.IncompleteFile]: 'Dossier incomplet',
  [FileInstructionRefusalReason.IrregularSituation]: 'En situation irrégulière'
})

export const helpRequestRefusalReasonKeys = buildKeys({
  ...baseRefusalReasonKeys.byKey,
  [FileInstructionRefusalReason.MissedAppointment]: 'Absence au rendez-vous',
  [FileInstructionRefusalReason.AlreadyExistingHelpRequest]:
    "Instruction déjà en cours auprès d'un autre organisme",
  [FileInstructionRefusalReason.Reoriented]:
    "Réorientation auprès d'un autre organisme",
  [FileInstructionRefusalReason.Debt]: 'Endettement',
  [FileInstructionRefusalReason.Other]: 'Autre'
})

export const housingFileInstructionRefusalReasonKeys = buildKeys({
  ...baseRefusalReasonKeys.byKey,
  [FileInstructionRefusalReason.InadequateFamilyComposition]:
    'Composition familiale inadaptée au type de logement',
  [FileInstructionRefusalReason.ExpiredRequest]: 'Demande expirée',
  [FileInstructionRefusalReason.Other]: 'Autre'
})

export const fileInstructionRefusalReasonKeys = {
  ...helpRequestRefusalReasonKeys,
  ...housingFileInstructionRefusalReasonKeys
}

export const fileInstructionTypeKeys = buildKeys({
  [FileInstructionType.Housing]: 'Une demande de logement',
  [FileInstructionType.Financial]: 'Une aide financière',
  [FileInstructionType.Other]: 'Autre'
})

export const fileInstructionTypeFilterKeys = buildKeys({
  [FileInstructionType.Housing]: 'Demande de logement',
  [FileInstructionType.Financial]: 'Aide financière',
  [FileInstructionType.Other]: 'Autre'
})

// As pictograms are used as variables, they have to be in the public directory. - See https://www.lichter.io/articles/nuxt3-vue3-dynamic-images/
export const fileInstructionTypePictos = {
  [FileInstructionType.Housing]: '/pictograms/building.svg',
  [FileInstructionType.Financial]: '/pictograms/tax-stamp.svg',
  [FileInstructionType.Other]: '/pictograms/document.svg'
}
