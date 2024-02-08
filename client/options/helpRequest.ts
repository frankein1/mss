import {
  SocialSupportStatus,
  PaymentMethod,
  FileInstructionRefusalReason
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'
import { HelpRequestSubject } from '~/types/socialSupport'

export const helpRequestStatusLabels = {
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

export const ministryHelpRequestStatusLabels = {
  ...helpRequestStatusLabels,
  [SocialSupportStatus.Accepted]: 'Traité'
}

export const externalOrganisationOptions = new Map([
  ['false', 'En interne'],
  ['true', 'En externe']
])

export const paymentMethodLabels: { [key in PaymentMethod]: string } = {
  [PaymentMethod.FoodStamps]: 'Bons alimentaires',
  [PaymentMethod.CreditCard]: 'Carte bancaire',
  [PaymentMethod.Check]: 'Chèque',
  [PaymentMethod.Cash]: 'Espèces',
  [PaymentMethod.WireTransfer]: 'Virement'
}

export const paymentMethodOptions = labelsToOptions(paymentMethodLabels)

export const helpRequestSubjectLabels: {
  [key in HelpRequestSubject]: string
} = {
  [HelpRequestSubject.Housing]: 'Une demande de logement',
  [HelpRequestSubject.Financial]: 'Une aide financière',
  [HelpRequestSubject.Other]: 'Autre'
}

export const helpRequestSubjectOptions = labelsToOptions(
  helpRequestSubjectLabels
)

export const helpRequestSubjectStatsLabels: {
  [key in HelpRequestSubject]: string
} = {
  [HelpRequestSubject.Housing]: 'Demande de logement',
  [HelpRequestSubject.Financial]: 'Aide financière',
  [HelpRequestSubject.Other]: 'Autre'
}

export const helpRequestSubjectStatsOptions = labelsToOptions(
  helpRequestSubjectStatsLabels
)

// As pictograms are used as variables, they have to be in the public directory. - See https://www.lichter.io/articles/nuxt3-vue3-dynamic-images/
export const helpRequestSubjectPictos: {
  [key in HelpRequestSubject]: string
} = {
  [HelpRequestSubject.Housing]: '/pictograms/building.svg',
  [HelpRequestSubject.Financial]: '/pictograms/tax-stamp.svg',
  [HelpRequestSubject.Other]: '/pictograms/document.svg'
}

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

export const isRefundableLabels = {
  true: 'Remboursable',
  false: 'Non remboursable'
}

export const isRefundableOptions = labelsToOptions(isRefundableLabels)
