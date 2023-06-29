import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
import { HistoryTab } from '~/utils/constants/history'

export enum Route {
  Index = 'Index',
  Register = 'Register',
  DeclarationAccessibilite = 'DeclarationAccessibilite',
  MentionsLegales = 'MentionsLegales',
  CGUManager = 'CGUManager',
  CGUUser = 'CGUUser',
  Env = 'Env',
  DisabledAccount = 'DisabledAccount',

  // AUTH
  AuthLogin = 'AuthLogin',
  AuthAdmin = 'AuthAdmin',
  AuthValidateToken = 'AuthValidateToken',
  AuthLogout = 'AuthLogout',

  // APP
  App = 'App',
  AppOverview = 'AppOverview',
  AppUsers = 'AppUsers',
  AppStats = 'AppStats',
  AppAccount = 'AppAccount',
  AppStructureEdit = 'AppStructureEdit',
  AppBeneficiaries = 'AppBeneficiaries',
  AppBeneficiariesAdd = 'AppBeneficiariesAdd',
  AppBeneficiary = 'AppBeneficiary',
  AppBeneficiaryPrint = 'AppBeneficiaryPrint',
  AppBeneficiaryEdit = 'AppBeneficiaryEdit',
  AppBeneficiaryFollowupAdd = 'AppBeneficiaryFollowupAdd',
  AppBeneficiaryFollowupEdit = 'AppBeneficiaryFollowupEdit',
  AppBeneficiaryHelpRequestAdd = 'AppBeneficiaryHelpRequestAdd',
  AppBeneficiaryHelpRequestEdit = 'AppBeneficiaryHelpRequestEdit',
  AppHistory = 'AppHistory',

  // ADMIN
  Admin = 'Admin',
  AdminOverview = 'AdminOverview',
  AdminLogin = 'AdminLogin',
  AdminStructures = 'AdminStructures',
  AdminUsers = 'AdminUsers'
}

const AppRoute = '/app'
const AdminRoute = '/admin'
const ApiKeycloak = '/api/keycloak'
const CGURoute = '/cgu'

const BeneficiariesRoute = `${AppRoute}/beneficiaries`

const BeneficiaryRoute = (
  beneficiaryId: string | undefined,
  options?: {
    tab?: BeneficiaryTab
    item?: string
    originPage?: Route.AppOverview | Route.AppBeneficiaries | Route.AppHistory
    originTab?: HistoryTab
  }
) => {
  if (!beneficiaryId) {
    return ''
  }
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

export const RoutePath = {
  [Route.Index]: () => '/',
  [Route.Register]: () => '/register',
  [Route.DeclarationAccessibilite]: () => '/declaration-accessibilite',
  [Route.MentionsLegales]: () => '/mentions-legales',
  [Route.Env]: () => '/env',
  [Route.DisabledAccount]: () => '/disabled-account',
  [Route.CGUManager]: () => `${CGURoute}/manager`,
  [Route.CGUUser]: () => `${CGURoute}/user`,

  // AUTH
  [Route.AuthLogin]: () => '/auth/login',
  [Route.AuthAdmin]: () => '/auth/admin',
  [Route.AuthValidateToken]: () => '/auth/validate-token',
  [Route.AuthLogout]: () => '/auth/logout',

  // API
  ApiLogout: () => `${ApiKeycloak}/logout`,
  ApiSsoCallback: () => `${ApiKeycloak}/callback`,

  // APP
  [Route.App]: () => `${AppRoute}`,
  [Route.AppOverview]: () => `${AppRoute}/overview`,
  [Route.AppUsers]: () => `${AppRoute}/users`,
  [Route.AppStats]: () => `${AppRoute}/stats`,
  [Route.AppAccount]: () => `${AppRoute}/account`,
  [Route.AppStructureEdit]: () => `${AppRoute}/structure/edit`,
  [Route.AppBeneficiaries]: () => BeneficiariesRoute,
  [Route.AppBeneficiariesAdd]: () => `${BeneficiariesRoute}/add`,
  [Route.AppBeneficiary]: BeneficiaryRoute,
  [Route.AppBeneficiaryPrint]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/print`,
  [Route.AppBeneficiaryEdit]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/edit`,
  [Route.AppBeneficiaryFollowupAdd]: (beneficiaryId: string) =>
    `${BeneficiaryFollowupsRoute(beneficiaryId)}/add`,
  [Route.AppBeneficiaryFollowupEdit]: (
    beneficiaryId: string,
    followupId: string
  ) => `${BeneficiaryFollowupsRoute(beneficiaryId)}/${followupId}/edit`,
  [Route.AppBeneficiaryHelpRequestAdd]: (beneficiaryId: string) =>
    `${BeneficiaryHelpRequestsRoute(beneficiaryId)}/add`,
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiaryId: string,
    helpRequestId: string
  ) => `${BeneficiaryHelpRequestsRoute(beneficiaryId)}/${helpRequestId}/edit`,
  [Route.AppHistory]: () => `${AppRoute}/history`,

  // ADMIN
  [Route.Admin]: () => `${AdminRoute}`,
  [Route.AdminOverview]: () => `${AdminRoute}/overview`,
  [Route.AdminStructures]: () => `${AdminRoute}/structures`,
  [Route.AdminUsers]: () => `${AdminRoute}/users`
}
