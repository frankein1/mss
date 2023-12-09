import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod,
  HelpRequestSubject,
  HelpRequestRefusalReason
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const helpRequestStatusLabels: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.WaitingAdditionalInformation]:
    'En attente de justificatifs',
  [HelpRequestStatus.InvestigationOngoing]: "En cours d'instruction",
  [HelpRequestStatus.Accepted]: 'Accepté',
  [HelpRequestStatus.Refused]: 'Refusé',
  [HelpRequestStatus.Adjourned]: 'Ajourné',
  [HelpRequestStatus.ClosedByBeneficiary]: 'Clôturé par le bénéficiaire',
  [HelpRequestStatus.ClosedByAgent]: "Clôturé par l'agent",
  [HelpRequestStatus.Dismissed]: 'Classé sans suite'
}

export const ministryHelpRequestStatusLabels: {
  [key in HelpRequestStatus]: string
} = {
  ...helpRequestStatusLabels,
  [HelpRequestStatus.Accepted]: 'Traité'
}

export const financialSupportOptions = new Map([
  ['true', 'Oui'],
  ['false', 'Non']
])

export const externalOrganisationOptions = new Map([
  ['false', 'En interne'],
  ['true', 'Par une organisation extérieure']
])

export const paymentMethodLabels: { [key in PaymentMethod]: string } = {
  [PaymentMethod.FoodStamps]: 'Bons alimentaires',
  [PaymentMethod.CreditCard]: 'Carte bancaire',
  [PaymentMethod.Check]: 'Chèque',
  [PaymentMethod.Cash]: 'Espèces',
  [PaymentMethod.WireTransfer]: 'Virement'
}

export const paymentMethodOptions = labelsToOptions(paymentMethodLabels)

export const helpRequestReasonLabels: { [key in HelpRequestReason]: string } = {
  [HelpRequestReason.Food]: 'Alimentation',
  [HelpRequestReason.Energy]: 'Énergie',
  [HelpRequestReason.Housing]: 'Logement',
  [HelpRequestReason.Other]: 'Autre'
}

export const helpRequestReasonOptions = labelsToOptions(helpRequestReasonLabels)

export const helpRequestRefusalReasonLabels: {
  [key in HelpRequestRefusalReason]: string
} = {
  [HelpRequestRefusalReason.ResourcesOutOfScale]: 'Ressources hors barème',
  [HelpRequestRefusalReason.ShortDeadline]: 'Délai trop court',
  [HelpRequestRefusalReason.IncompleteFile]: 'Dossier incomplet',
  [HelpRequestRefusalReason.IrregularSituation]: 'En situation irrégulière',
  [HelpRequestRefusalReason.InadequateFamilyComposition]:
    'Composition familiale inadaptée au type de logement',
  [HelpRequestRefusalReason.ExpiredRequest]: 'Demande expirée',
  [HelpRequestRefusalReason.Other]: 'Autre'
}

export const helpRequestRefusalReasonOptions = labelsToOptions(
  helpRequestRefusalReasonLabels
)

export const helpRequestSubjectOptions = new Map<
  HelpRequestSubject,
  { label: string; picto: string }
>([
  [
    HelpRequestSubject.Housing,
    {
      label: 'Une demande de logement',
      picto: '~/assets/pictograms/building.svg'
    }
  ],
  [
    HelpRequestSubject.Financial,
    {
      label: 'Une aide financière',
      picto: '~/assets/pictograms/tax-stamp.svg'
    }
  ],
  [
    HelpRequestSubject.Other,
    { label: 'Autre', picto: '~/assets/pictograms/document.svg' }
  ]
])
