import { FilesRoute, getRouteOptions } from './utils'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'

export interface FollowupAddRouteOptions {
  beneficiaryId?: string
}

export const routes = {
  AppBeneficiaryFollowupAdd: {
    name: 'AppBeneficiaryFollowupAdd',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
        : 'Entretien avec un·e bénéficiaire',
    path: (familyFileId: string, options?: FollowupAddRouteOptions) =>
      `${FilesRoute}/${familyFileId}/followups/add${getRouteOptions(options)}`
  },
  AppBeneficiaryFollowupEdit: {
    name: 'AppBeneficiaryFollowupEdit',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Modifier l'entretien avec ${formatBeneficiaryDisplayName(beneficiary)}`
        : "Modifier l'entretien avec un·e bénéficiaire",
    path: (familyFileId: string, followupId: string) =>
      `${FilesRoute}/${familyFileId}/followups/${followupId}/edit`
  }
} as const
