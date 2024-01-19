import {
  SocialSupportStatus,
  PaymentMethod,
  HelpRequestSubject,
  HelpRequestRefusalReason
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'
import { ExtendedHelpRequestSubject } from '~/types/socialSupport'

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
  [key in ExtendedHelpRequestSubject]: string
} = {
  [ExtendedHelpRequestSubject.Housing]: 'Une demande de logement',
  [HelpRequestSubject.Financial]: 'Une aide financière',
  [HelpRequestSubject.Other]: 'Autre'
}

// As pictograms are used as variables, they have to be in the public directory. - See https://www.lichter.io/articles/nuxt3-vue3-dynamic-images/
export const helpRequestSubjectPictos: {
  [key in ExtendedHelpRequestSubject]: string
} = {
  [ExtendedHelpRequestSubject.Housing]: '/pictograms/building.svg',
  [HelpRequestSubject.Financial]: '/pictograms/tax-stamp.svg',
  [HelpRequestSubject.Other]: '/pictograms/document.svg'
}

export const helpRequestSubjectOptions = labelsToOptions(
  helpRequestSubjectLabels,
  { pictos: helpRequestSubjectPictos }
)

const baseRefusalReasonLabels = {
  [HelpRequestRefusalReason.ResourcesOutOfScale]: 'Ressources hors barème',
  [HelpRequestRefusalReason.ShortDeadline]: 'Délai trop court',
  [HelpRequestRefusalReason.IncompleteFile]: 'Dossier incomplet',
  [HelpRequestRefusalReason.IrregularSituation]: 'En situation irrégulière'
}

export const helpRequestRefusalReasonLabels = {
  ...baseRefusalReasonLabels,
  [HelpRequestRefusalReason.MissedAppointment]: 'Absence au rendez-vous',
  [HelpRequestRefusalReason.AlreadyExistingHelpRequest]:
    "Instruction déjà en cours auprès d'un autre organisme",
  [HelpRequestRefusalReason.Reoriented]:
    "Réorientation auprès d'un autre organisme",
  [HelpRequestRefusalReason.Debt]: 'Endettement',
  [HelpRequestRefusalReason.Other]: 'Autre'
}

const housingHelpRequestRefusalReasonLabels = {
  ...baseRefusalReasonLabels,
  [HelpRequestRefusalReason.InadequateFamilyComposition]:
    'Composition familiale inadaptée au type de logement',
  [HelpRequestRefusalReason.ExpiredRequest]: 'Demande expirée',
  [HelpRequestRefusalReason.Other]: 'Autre'
}

export const anyRefusalReasonLabels = {
  ...helpRequestRefusalReasonLabels,
  ...housingHelpRequestRefusalReasonLabels
}

export const helpRequestRefusalReasonOptions = labelsToOptions(
  helpRequestRefusalReasonLabels
)

export const housingHelpRequestRefusalReasonOptions = labelsToOptions(
  housingHelpRequestRefusalReasonLabels
)

export const isRefundableLabels = {
  true: 'Remboursable',
  false: 'Non remboursable'
}

export const isRefundableOptions = labelsToOptions(isRefundableLabels)
