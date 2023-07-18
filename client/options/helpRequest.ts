import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod
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
