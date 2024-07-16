import { AppRoute, BeneficiariesRoute } from './utils'
import { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { HistoryTab } from '~/utils/constants/history'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'
import { TypeSuivi } from '~/client/options'

type OriginPage =
  | 'AppOverview'
  | 'AppBeneficiaries'
  | 'AppHistory'
  | 'AppFileBudgetInfoEdit'
  | 'AppBeneficiaryBudgetIncomeEdit'
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
  originTab?: HistoryTab
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
    originTab?: HistoryTab
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
    path: () => BeneficiariesRoute
  },
  AppBeneficiariesAdd: {
    name: 'AppBeneficiariesAdd',
    title: 'Créer un·e bénéficiaire',
    path: () => `${BeneficiariesRoute}/add`
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
    title: 'Foyer fiscal',
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
    title: 'Structures extérieures',
    path: (beneficiaryId: string, options?: BeneficiaryEditRouteOptions) =>
      getBeneficiaryEditRoute(
        `${BeneficiariesRoute}/${beneficiaryId}/edit/external-organisations`,
        options
      )
  },
  AppHistory: {
    name: 'AppHistory',
    title: 'Accompagnements',
    path: (tab?: HistoryTab) => {
      const tabHash = tab ? `#${tab}` : ''
      return `${AppRoute}/history${tabHash}`
    }
  },
  AppHistoryPrint: {
    name: 'AppHistoryPrint',
    title: 'Imprimer la fiche',
    path: (historyId: string, type?: TypeSuivi) => {
      let routeUrl = `${AppRoute}/historyprint/${historyId}/print`
      if (type) {
        routeUrl = routeUrl + `?type=${type}`
      }
      return routeUrl
    }
  }
} as const
