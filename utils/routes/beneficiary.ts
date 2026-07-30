import { FilesRoute, BeneficiariesRoute } from './utils'
import type { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import type { BeneficiaryNames } from '~/types/beneficiary'
import type { FilterBeneficiaryNotFilled } from '../constants/filters'

type OriginPage =
  | 'AppOverview'
  | 'AppBeneficiaries'
  | 'AppHistory'
  | 'AppFileBudgetInfoEdit'
  | 'AppFileBudgetIncomeEdit'
  | 'AppFileBudgetExpensesEdit'

export type AppBeneficiaryEditRoute =
  | 'AppBeneficiaryEditInfo'
  | 'AppBeneficiaryEditTaxHousehold'
  | 'AppBeneficiaryEditEntourage'
  | 'AppBeneficiaryEditHealth'
  | 'AppBeneficiaryEditOccupation'
  | 'AppBeneficiaryEditExternalOrganisations'

function createSuffixUrl(options?: {
  tab?: BeneficiaryTab
  item?: string
  originPage?: OriginPage
  originTab?: string
}) {
  const hasDefinedOptions = options && Object.values(options).every(o => !!o)

  if (hasDefinedOptions) {
    const { tab, ...params } = options
    const tabHash = tab ? `#${tab}` : ''

    if (Object.keys(params).length) {
      const urlParams = new URLSearchParams(params)
      return `?${urlParams}${tabHash}`
    }

    return tabHash
  }

  return ''
}

function getBeneficiaryRoute(
  beneficiaryId: string | undefined,
  options?: {
    tab?: BeneficiaryTab
    item?: string
    originPage?: OriginPage
    originTab?: string
  }
) {
  if (!beneficiaryId) {
    return ''
  }

  const base = `${BeneficiariesRoute}/${beneficiaryId}`
  const suffix = createSuffixUrl(options)

  return `${base}${suffix}`
}

type BeneficiaryEditRouteOptions = {
  saved?: boolean
  originTab?: BeneficiaryTab
}

function getBeneficiaryEditRoute(
  route: string,
  options?: BeneficiaryEditRouteOptions
) {
  if (!options) {
    return route
  }

  const params = new URLSearchParams()

  if (options.saved) {
    params.append('saved', 'true')
  }

  if (options.originTab) {
    params.append('originTab', options.originTab)
  }

  return params.size ? `${route}?${params}` : route
}

export const routes = {
  AppBeneficiaries: {
    name: 'AppBeneficiaries',
    title: 'Bénéficiaires',
    path: (options?: { notFilled?: FilterBeneficiaryNotFilled }) =>
      options && options.notFilled
        ? `${BeneficiariesRoute}?not-filled=${options.notFilled}`
        : BeneficiariesRoute
  },
  // TODO will be obsolete and removed when migrated to file
  AppBeneficiariesAdd: {
    name: 'AppBeneficiariesAdd',
    title: 'Créer un dossier',
    path: () => `${FilesRoute}/add`
  },
  AppBeneficiariesArchive: {
    name: 'AppBeneficiariesAdd',
    title: 'Gérer le dossier',
    path: (beneficiaryId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/archive`
  },
  AppBeneficiariesReferentTransfer: {
    name: 'AppBeneficiariesReferentTransfer',
    title: 'Modifier les agents référents',
    path: () => `${BeneficiariesRoute}/referent-transfer`
  },
  AppBeneficiary: {
    name: 'AppBeneficiary',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary ? formatBeneficiaryDisplayName(beneficiary) : '',
    path: getBeneficiaryRoute
  },
  AppBeneficiaryPrint: {
    name: 'AppBeneficiaryPrint',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Imprimer la fiche de ${formatBeneficiaryDisplayName(beneficiary)}`
        : '',
    path: (beneficiaryId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/print`
  },
  AppBeneficiaryEdit: {
    name: 'AppBeneficiaryEdit',
    title: (beneficiary: BeneficiaryNames | null) =>
      beneficiary
        ? `Modifier ${formatBeneficiaryDisplayName(beneficiary)}`
        : '',
    path: (beneficiaryId: string) => getBeneficiaryEditRoute(beneficiaryId)
  },
  AppBeneficiaryEditInfo: {
    name: 'AppBeneficiaryEditInfo',
    title: 'Informations bénéficiaire',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/info`,
        options
      )
  },
  AppBeneficiaryEditTaxHousehold: {
    name: 'AppBeneficiaryEditTaxHousehold',
    title: 'Situation familiale',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/tax-household`,
        options
      )
  },
  AppBeneficiaryEditEntourage: {
    name: 'AppBeneficiaryEditEntourage',
    title: 'Entourage',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/entourage`,
        options
      )
  },
  AppBeneficiaryEditHealth: {
    name: 'AppBeneficiaryEditHealth',
    title: 'Santé',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/health`,
        options
      )
  },
  AppBeneficiaryEditOccupation: {
    name: 'AppBeneficiaryEditOccupation',
    title: 'Activité',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/occupation`,
        options
      )
  },
  AppBeneficiaryEditExternalOrganisations: {
    name: 'AppBeneficiaryEditExternalOrganisations',
    title: 'Partenaires',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/external-organisations`,
        options
      )
  },
  AppBeneficiaryArchive: {
    name: 'AppBeneficiaryArchive',
    title: () => 'Gérer le dossier',
    path: (beneficiaryId: string) =>
      `${BeneficiariesRoute}/${beneficiaryId}/archive`
  }
} as const
