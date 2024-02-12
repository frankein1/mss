import { PaymentMethod } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

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

export const isRefundableLabels = {
  true: 'Remboursable',
  false: 'Non remboursable'
}

export const isRefundableOptions = labelsToOptions(isRefundableLabels)
