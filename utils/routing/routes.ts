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

export enum Route {
  Index = 'Index',
  Register = 'Register',
  DeclarationAccessibilite = 'DeclarationAccessibilite',
  MentionsLegales = 'MentionsLegales',
  Env = 'Env',
  LogoutSuccess = 'LogoutSuccess',
  DisabledAccount = 'DisabledAccount',
  Login = 'Login',
  App = 'App',
  Overview = 'Overview',
  Users = 'Users',
  Stats = 'Stats',
  Account = 'Account',
  StructureEdit = 'StructureEdit',
  Beneficiaries = 'Beneficiaries',
  BeneficiariesAdd = 'BeneficiariesAdd',
  Beneficiary = 'Beneficiary',
  BeneficiaryPrint = 'BeneficiaryPrint',
  BeneficiaryEdit = 'BeneficiaryEdit',
  BeneficiaryFollowupAdd = 'BeneficiaryFollowupAdd',
  BeneficiaryFollowupEdit = 'BeneficiaryFollowupEdit',
  BeneficiaryHelpRequestAdd = 'BeneficiaryHelpRequestAdd',
  BeneficiaryHelpRequestEdit = 'BeneficiaryHelpRequestEdit',
  History = 'History'
}

export const RoutePath = {
  [Route.Index]: () => '/',
  [Route.Register]: () => '/register',
  [Route.DeclarationAccessibilite]: () => '/declaration-accessibilite',
  [Route.MentionsLegales]: () => '/mentions-legales',
  [Route.Env]: () => `/env`,
  [Route.LogoutSuccess]: () => '/logout-success',
  [Route.DisabledAccount]: () => '/disabled-account',

  [Route.Login]: () => '/login',
  Logout: () => `${ApiKeycloak}/logout`,
  SsoCallback: () => `${ApiKeycloak}/callback`,

  [Route.App]: () => `${AppRoute}`,
  [Route.Overview]: () => `${AppRoute}/overview`,

  [Route.Users]: () => `${AppRoute}/users`,

  [Route.Stats]: () => `${AppRoute}/stats`,

  [Route.Account]: () => `${AppRoute}/account`,

  [Route.StructureEdit]: () => `${AppRoute}/structure/edit`,

  // beneficiaries
  [Route.Beneficiaries]: () => BeneficiariesRoute,
  [Route.BeneficiariesAdd]: () => `${BeneficiariesRoute}/add`,

  [Route.Beneficiary]: BeneficiaryRoute,
  [Route.BeneficiaryPrint]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/print`,
  [Route.BeneficiaryEdit]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/edit`,

  [Route.BeneficiaryFollowupAdd]: (beneficiaryId: string) =>
    `${BeneficiaryFollowupsRoute(beneficiaryId)}/add`,
  [Route.BeneficiaryFollowupEdit]: (
    beneficiaryId: string,
    followupId: string
  ) => `${BeneficiaryFollowupsRoute(beneficiaryId)}/${followupId}/edit`,

  [Route.BeneficiaryHelpRequestAdd]: (beneficiaryId: string) =>
    `${BeneficiaryHelpRequestsRoute(beneficiaryId)}/add`,
  [Route.BeneficiaryHelpRequestEdit]: (
    beneficiaryId: string,
    helpRequestId: string
  ) => `${BeneficiaryHelpRequestsRoute(beneficiaryId)}/${helpRequestId}/edit`,

  [Route.History]: () => `${AppRoute}/history`
}
