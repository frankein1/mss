import { PaymentMethod } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const externalOrganisationKeys = buildKeys({
  false: 'En interne',
  true: 'En externe'
})

export const paymentMethodKeys = buildKeys({
  [PaymentMethod.FoodStamps]: 'Bons alimentaires',
  [PaymentMethod.CreditCard]: 'Carte bancaire',
  [PaymentMethod.Check]: 'Chèque',
  [PaymentMethod.Cash]: 'Espèces',
  [PaymentMethod.WireTransfer]: 'Virement'
})

export const isRefundableKeys = buildKeys({
  true: 'Remboursable',
  false: 'Non remboursable'
})
