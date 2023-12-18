import {
  HelpRequestStatus,
  PaymentMethod,
  HelpRequestSubject
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

export const helpRequestSubjectLabels: { [key in HelpRequestSubject]: string } =
  {
    [HelpRequestSubject.Housing]: 'Une demande de logement',
    [HelpRequestSubject.Financial]: 'Une aide financière',
    [HelpRequestSubject.Other]: 'Autre'
  }

const helpRequestSubjectPictos: { [key in HelpRequestSubject]: string } = {
  [HelpRequestSubject.Housing]: '~/assets/pictograms/building.svg',
  [HelpRequestSubject.Financial]: '~/assets/pictograms/tax-stamp.svg',
  [HelpRequestSubject.Other]: '~/assets/pictograms/document.svg'
}

export const helpRequestSubjectOptions = labelsToOptions(
  helpRequestSubjectLabels,
  helpRequestSubjectPictos
)
