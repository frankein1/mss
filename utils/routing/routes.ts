import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
import { HistoryTab } from '~/utils/constants/history'

const AppRoute = '/app'
const ApiKeycloak = '/api/keycloak'

const BeneficiariesRoute = `${AppRoute}/beneficiaries`

const BeneficiaryRoute = (
  beneficiaryId: string,

  options?: {
    tab?: BeneficiaryTab
    item?: string
    originPage?: string
    originTab?: HistoryTab
  }
) => {
  const base = `${BeneficiariesRoute}/${beneficiaryId}`
  if (options) {
    const { tab, ...params } = options
    const tabHash = tab ? `#${tab}` : ''
    if (Object.keys(params).length) {
      const urlParams = new URLSearchParams(params)
      return `${base}?${urlParams}${tabHash}`
    }
    return `${base}${tabHash}`
  }
  return base
}

const BeneficiaryFollowupsRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/followups`

const BeneficiaryHelpRequestsRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/help-requests`

export const Routes = {
  Index: () => '/',
  Register: () => '/register',
  DeclarationAccessibilite: () => `/declaration-accessibilite`,
  MentionsLegales: () => `/mentions-legales`,
  Env: () => `/env`,
  LogoutSuccess: () => `/logout-success`,

  Login: () => '/login',
  Logout: () => `${ApiKeycloak}/logout`,
  SsoCallback: () => `${ApiKeycloak}/callback`,

  App: () => `${AppRoute}`,
  Overview: () => `${AppRoute}/overview`,

  Users: () => `${AppRoute}/users`,

  Stats: () => `${AppRoute}/stats`,

  Account: () => `${AppRoute}/account`,

  StructureEdit: () => `${AppRoute}/structure/edit`,

  // beneficiaries
  Beneficiaries: () => BeneficiariesRoute,
  BeneficiariesAdd: () => `${BeneficiariesRoute}/add`,

  Beneficiary: BeneficiaryRoute,
  BeneficiaryPrint: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/print`,
  BeneficiaryEdit: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/edit`,

  BeneficiaryFollowupAdd: (beneficiaryId: string) =>
    `${BeneficiaryFollowupsRoute(beneficiaryId)}/add`,

  BeneficiaryHelpRequestAdd: (beneficiaryId: string) =>
    `${BeneficiaryHelpRequestsRoute(beneficiaryId)}/add`,

  History: () => `${AppRoute}/history`
}
