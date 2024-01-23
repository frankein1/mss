import { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { HistoryTab } from '~/utils/constants/history'
import { HelpRequestSubject } from '~/types/socialSupport'

export enum Route {
  Index = 'Index',
  Register = 'Register',
  DeclarationAccessibilite = 'DeclarationAccessibilite',
  MentionsLegales = 'MentionsLegales',
  CGUManager = 'CGUManager',
  CGUUser = 'CGUUser',
  Env = 'Env',

  // ERROR
  ErrorDisabledAccount = 'ErrorDisabledAccount',
  ErrorUnknownUser = 'ErrorUnknownUser',

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
  AppBeneficiariesSave = 'AppBeneficiariesSave',
  AppBeneficiariesSaveInfo = 'AppBeneficiariesSaveInfo',
  AppBeneficiariesSaveTaxHousehold = 'AppBeneficiariesSaveTaxHousehold',
  AppBeneficiariesSaveEntourage = 'AppBeneficiariesSaveEntourage',
  AppBeneficiariesSaveHealth = 'AppBeneficiariesSaveHealth',
  AppBeneficiariesSaveOccupation = 'AppBeneficiariesSaveOccupation',
  AppBeneficiariesSaveExternalOrganisations = 'AppBeneficiariesSaveExternalOrganisations',
  AppBeneficiary = 'AppBeneficiary',
  AppBeneficiaryPrint = 'AppBeneficiaryPrint',
  AppBeneficiaryEdit = 'AppBeneficiaryEdit',
  AppBeneficiaryEditInfo = 'AppBeneficiaryEditInfo',
  AppBeneficiaryEditTaxHousehold = 'AppBeneficiaryEditTaxHousehold',
  AppBeneficiaryEditEntourage = 'AppBeneficiaryEditEntourage',
  AppBeneficiaryEditHealth = 'AppBeneficiaryEditHealth',
  AppBeneficiaryEditOccupation = 'AppBeneficiaryEditOccupation',
  AppBeneficiaryEditExternalOrganisations = 'AppBeneficiaryEditExternalOrganisations',
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
  AdminStructuresAdd = 'AdminStructuresAdd',
  AdminStructure = 'AdminStructure',
  AdminUsers = 'AdminUsers',
  AdminUsersAdd = 'AdminUsersAdd',
  AdminUser = 'AdminUser',
  AdminEmails = 'AdminEmails'
}

export type AppBeneficiariesSaveRoute =
  | (typeof Route)['AppBeneficiariesSaveInfo']
  | (typeof Route)['AppBeneficiariesSaveTaxHousehold']
  | (typeof Route)['AppBeneficiariesSaveEntourage']
  | (typeof Route)['AppBeneficiariesSaveHealth']
  | (typeof Route)['AppBeneficiariesSaveOccupation']
  | (typeof Route)['AppBeneficiariesSaveExternalOrganisations']

export type AppBeneficiaryEditRoute =
  | (typeof Route)['AppBeneficiaryEditInfo']
  | (typeof Route)['AppBeneficiaryEditTaxHousehold']
  | (typeof Route)['AppBeneficiaryEditEntourage']
  | (typeof Route)['AppBeneficiaryEditHealth']
  | (typeof Route)['AppBeneficiaryEditOccupation']
  | (typeof Route)['AppBeneficiaryEditExternalOrganisations']

const AppRoute = '/app'
const AdminRoute = '/admin'
const ApiKeycloak = '/api/keycloak'
const CGURoute = '/cgu'
const ErrorRoute = '/error'

const BeneficiariesRoute = `${AppRoute}/beneficiaries`

const BeneficiarySaveRoute = (draftId: string) =>
  `${BeneficiariesRoute}/save/${draftId}`

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
  const hasDefinedOptions = options && Object.values(options).every(o => !!o)
  if (hasDefinedOptions) {
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

const BeneficiaryEditRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/edit`

const BeneficiaryFollowupsRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/followups`

const BeneficiaryHelpRequestsRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/help-requests`

type BeneficiaryEditRouteOptions = {
  saved?: boolean
  originTab?: BeneficiaryTab
}

const beneficiaryEditRoute = (
  route: string,
  options: BeneficiaryEditRouteOptions | undefined
) => {
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

export const RoutePath = {
  [Route.Index]: () => '/',
  [Route.Register]: () => '/register',
  [Route.DeclarationAccessibilite]: () => '/declaration-accessibilite',
  [Route.MentionsLegales]: () => '/mentions-legales',
  [Route.CGUManager]: () => `${CGURoute}/manager`,
  [Route.CGUUser]: () => `${CGURoute}/user`,

  // ERROR
  [Route.ErrorDisabledAccount]: () => `${ErrorRoute}/disabled-account`,
  [Route.ErrorUnknownUser]: () => `${ErrorRoute}/unknown-user`,

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
  [Route.AppBeneficiariesSave]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}`,
  [Route.AppBeneficiariesSaveInfo]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/info`,
  [Route.AppBeneficiariesSaveTaxHousehold]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/tax-household`,
  [Route.AppBeneficiariesSaveEntourage]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/entourage`,
  [Route.AppBeneficiariesSaveHealth]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/health`,
  [Route.AppBeneficiariesSaveOccupation]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/occupation`,
  [Route.AppBeneficiariesSaveExternalOrganisations]: (draftId: string) =>
    `${BeneficiarySaveRoute(draftId)}/external-organisations`,
  [Route.AppBeneficiary]: BeneficiaryRoute,
  [Route.AppBeneficiaryPrint]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/print`,

  [Route.AppBeneficiaryEdit]: (beneficiaryId: string) =>
    BeneficiaryEditRoute(beneficiaryId),
  [Route.AppBeneficiaryEditInfo]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/info`,
      options
    ),
  [Route.AppBeneficiaryEditTaxHousehold]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/tax-household`,
      options
    ),
  [Route.AppBeneficiaryEditEntourage]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/entourage`,
      options
    ),
  [Route.AppBeneficiaryEditHealth]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/health`,
      options
    ),
  [Route.AppBeneficiaryEditOccupation]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/occupation`,
      options
    ),
  [Route.AppBeneficiaryEditExternalOrganisations]: (
    beneficiaryId: string,
    options?: BeneficiaryEditRouteOptions
  ) =>
    beneficiaryEditRoute(
      `${BeneficiaryEditRoute(beneficiaryId)}/external-organisations`,
      options
    ),

  [Route.AppBeneficiaryFollowupAdd]: (beneficiaryId: string) =>
    `${BeneficiaryFollowupsRoute(beneficiaryId)}/add`,
  [Route.AppBeneficiaryFollowupEdit]: (
    beneficiaryId: string,
    followupId: string
  ) => `${BeneficiaryFollowupsRoute(beneficiaryId)}/${followupId}/edit`,
  [Route.AppBeneficiaryHelpRequestAdd]: (
    beneficiaryId: string,
    subject: HelpRequestSubject
  ) =>
    `${BeneficiaryHelpRequestsRoute(
      beneficiaryId
    )}/${subject.toLocaleLowerCase()}/add`,
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiaryId: string,
    helpRequestId: string,
    subject: HelpRequestSubject
  ) =>
    `${BeneficiaryHelpRequestsRoute(
      beneficiaryId
    )}/${subject.toLocaleLowerCase()}/${helpRequestId}/edit`,
  [Route.AppHistory]: () => `${AppRoute}/history`,

  // ADMIN
  [Route.Admin]: () => `${AdminRoute}`,
  [Route.AdminOverview]: () => `${AdminRoute}/overview`,
  [Route.AdminStructures]: () => `${AdminRoute}/structures`,
  [Route.AdminStructuresAdd]: () => `${AdminRoute}/structures/add`,
  [Route.AdminStructure]: (structureId: string) =>
    `${AdminRoute}/structures/${structureId}`,
  [Route.AdminUsers]: () => `${AdminRoute}/users`,
  [Route.AdminUsersAdd]: () => `${AdminRoute}/users/add`,
  [Route.AdminUser]: (userId: string) => `${AdminRoute}/users/${userId}`,
  [Route.AdminEmails]: () => `${AdminRoute}/emails`
}
