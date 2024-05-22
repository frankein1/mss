import { buildKeys } from '~/utils/keys/keyBuilder'

export const budgetExpensesKeys = buildKeys({
  rent: 'Loyer',
  expenses: 'Charges',
  water: 'Eau',
  electricity: 'Electricité',
  gas: 'Gaz',
  fuelOrOther: 'Fuel (ou autre mode de chauffage)',

  // Impôts
  housingTax: "Taxe d'habitation",
  propertyTax: 'Taxe foncière',
  incomeTax: 'Impôt sur le revenu',

  // Autres charges
  remittedAlimony: 'Pension alimentaire versée',
  healthInsurance: 'Mutuelle',
  phoneInternet: 'Téléphone/internet',
  insurance: 'Assurance',
  carInsurance: 'Assurance voiture',
  schoolFees: 'Frais de garde ou de scolarité',
  schoolCanteen: 'Cantine',
  other: 'Autres charges et frais divers',

  // Crédits et dettes
  debts: 'Dette(s)',
  loans: 'Crédit(s)'
})

export const budgetLoansKeys = buildKeys({
  type: 'Type de crédit',
  amountTotal: 'Montant total',
  amountPerMonth: 'Montant mensuel',
  dueDate: 'Echéance du crédit'
})

export const budgetIncomeKeys = buildKeys({
  // Travail
  salary: 'Salaire',
  primeActivite: "Prime d'activité",

  // Pensions
  retirement: 'Retraite',
  alimony: 'Pension alimentaire reçue',
  disability: "Pension d'invalidité",

  // Allocations
  unemployment: 'Allocations chômage - ARE',
  ass: 'Allocation spécifique de solidarité - ASS',
  rsa: 'Revenu de solidarité active - RSA',
  apl: 'Allocations logement - APL',
  family: 'Allocations familiales',
  aah: 'Allocation adulte handicapé - AAH',
  aspa: 'Allocation de solidarité aux personnes âgées - ASPA',

  // Autre ressources
  dailyAllowance: 'Indemnités journalières',
  annuity: 'Rentes',
  other: 'Autre'
})
