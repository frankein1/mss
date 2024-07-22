import { BeneficiariesRoute } from './utils'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export const routes = {
  AppBeneficiaryFollowupAdd: {
    name: 'AppBeneficiaryFollowupAdd',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
        : 'Entretien avec un·e bénéficiaire',
    path: (beneficiaryId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/followups/add`
  },
  AppBeneficiaryFollowupEdit: {
    name: 'AppBeneficiaryFollowupEdit',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Modifier l'entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
        : "Modifier l'entretien avec un·e bénéficiaire",
    path: (beneficiaryId: string, followupId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/followups/${followupId}/edit`
  }
} as const
