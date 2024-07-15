import { FileInstructionType } from '@prisma/client'
import { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { HistoryTab } from '~/utils/constants/history'

export enum Route {
  Index = 'Index',
  Register = 'Register',
  DeclarationAccessibilite = 'DeclarationAccessibilite',
  MentionsLegales = 'MentionsLegales',
  CGUManager = 'CGUManager',
  CGUUser = 'CGUUser',
  PolitiqueConfidentialite = 'PolitiqueConfidentialite',
  Statistiques = 'Statistiques',

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
  AppPartners = 'AppPartners',
  AppStats = 'AppStats',
  AppAccount = 'AppAccount',
  AppStructure = 'AppStructure',
  AppStructureEdit = 'AppStructureEdit',
  AppStructureSubjects = 'AppStructureSubjects',
  AppBeneficiaries = 'AppBeneficiaries',
  AppBeneficiariesAdd = 'AppBeneficiariesAdd',
  AppBeneficiary = 'AppBeneficiary',
  AppBeneficiaryPrint = 'AppBeneficiaryPrint',
  AppBeneficiaryBudgetIncomeEdit = 'AppBeneficiaryBudgetIncomeEdit',
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
  AppHistoryPrint = 'AppHistoryPrint',

  // FILE
  AppFile = 'AppFile',
  AppFileBudgetInfoEdit = 'AppFileBudgetInfoEdit',
  AppFileBudgetExpensesEdit = 'AppFileBudgetExpensesEdit',

  // ADMIN
  Admin = 'Admin',
  AdminOverview = 'AdminOverview',
  AdminLogin = 'AdminLogin',
  AdminStructures = 'AdminStructures',
  AdminStructure = 'AdminStructure',
  AdminStructureSubjects = 'AdminStructureSubjects',
  AdminUsers = 'AdminUsers',
  AdminUsersAdd = 'AdminUsersAdd',
  AdminUser = 'AdminUser',
  AdminEmails = 'AdminEmails',
  AdminIntegrations = 'AdminIntegrations'
}

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

function createSuffixUrl(options?: {
  tab?: BeneficiaryTab
  item?: string
  originPage?:
    | Route.AppOverview
    | Route.AppBeneficiaries
    | Route.AppHistory
    | Route.AppFileBudgetInfoEdit
    | Route.AppBeneficiaryBudgetIncomeEdit
    | Route.AppFileBudgetExpensesEdit
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

const BeneficiaryRoute = (
  beneficiaryId: string | undefined,
  options?: {
    tab?: BeneficiaryTab
    item?: string
    originPage?:
      | Route.AppOverview
      | Route.AppBeneficiaries
      | Route.AppHistory
      | Route.AppFileBudgetInfoEdit
      | Route.AppBeneficiaryBudgetIncomeEdit
      | Route.AppFileBudgetExpensesEdit
    originTab?: HistoryTab
  }
) => {
  if (!beneficiaryId) {
    return ''
  }
  const base = `${BeneficiariesRoute}/${beneficiaryId}`
  const suffix = createSuffixUrl(options)
  return `${base}${suffix}`
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

type CGURouteOptions = {
  readonly: boolean
}

const getCGURoute = (route: string, options?: CGURouteOptions) => {
  if (options?.readonly) {
    const params = new URLSearchParams()
    params.append('readonly', 'true')

    return `${route}?${params}`
  }

  return route
}

export const RoutePath = {
  [Route.Index]: () => '/',
  [Route.Register]: () => '/register',
  [Route.DeclarationAccessibilite]: () => '/declaration-accessibilite',
  [Route.MentionsLegales]: () => '/mentions-legales',
  [Route.CGUManager]: (options?: CGURouteOptions) =>
    getCGURoute(`${CGURoute}/manager`, options),
  [Route.CGUUser]: (options?: CGURouteOptions) =>
    getCGURoute(`${CGURoute}/user`, options),
  [Route.PolitiqueConfidentialite]: () => '/politique-confidentialite',
  [Route.Statistiques]: () => `/statistiques`,

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
  [Route.AppPartners]: () => `${AppRoute}/partners`,
  [Route.AppStats]: () => `${AppRoute}/stats`,
  [Route.AppAccount]: () => `${AppRoute}/account`,
  [Route.AppStructure]: () => `${AppRoute}/structure`,
  [Route.AppStructureEdit]: () => `${AppRoute}/structure/edit`,
  [Route.AppStructureSubjects]: () => `${AppRoute}/structure/subjects`,
  [Route.AppBeneficiaries]: () => BeneficiariesRoute,
  [Route.AppBeneficiariesAdd]: () => `${BeneficiariesRoute}/add`,
  [Route.AppBeneficiary]: BeneficiaryRoute,
  [Route.AppBeneficiaryPrint]: (beneficiaryId: string) =>
    `${BeneficiaryRoute(beneficiaryId)}/print`,
  // [Route.AppBeneficiaryBudgetExpensesEdit]: (
  //   fileId: string,
  //   expensesId: string
  // ) => `${FileRoute(fileId)}/expenses/${expensesId}/edit`,
  [Route.AppBeneficiaryBudgetIncomeEdit]: (
    beneficiaryId: string,
    incomeId: string
  ) => `${BeneficiaryRoute(beneficiaryId)}/income/${incomeId}/edit`,
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
    subject: FileInstructionType
  ) =>
    `${BeneficiaryHelpRequestsRoute(
      beneficiaryId
    )}/${subject.toLocaleLowerCase()}/add`,
  [Route.AppBeneficiaryHelpRequestEdit]: (
    beneficiaryId: string,
    helpRequestId: string,
    subject: FileInstructionType
  ) =>
    `${BeneficiaryHelpRequestsRoute(
      beneficiaryId
    )}/${subject.toLocaleLowerCase()}/${helpRequestId}/edit`,

  [Route.AppHistory]: (tab?: HistoryTab) => {
    const tabHash = tab ? `#${tab}` : ''
    return `${AppRoute}/history${tabHash}`
  },
  [Route.AppHistoryPrint]: (historyId: string) =>
    `${AppRoute}/historyprint/${historyId}/print`,

  // FAMILY FILE
  [Route.AppFile]: (familyFileId: string) => `/app/files/${familyFileId}`,
  [Route.AppFileBudgetInfoEdit]: (familyFileId: string) =>
    `/app/files/${familyFileId}/budget/edit`,
  [Route.AppFileBudgetExpensesEdit]: (
    familyFileId: string,
    expensesId: string
  ) => `/app/files/${familyFileId}/expenses/${expensesId}/edit`,

  // ADMIN
  [Route.Admin]: () => `${AdminRoute}`,
  [Route.AdminOverview]: () => `${AdminRoute}/overview`,
  [Route.AdminStructures]: () => `${AdminRoute}/structures`,
  [Route.AdminStructure]: (structureId: string) =>
    `${AdminRoute}/structures/${structureId}`,
  [Route.AdminStructureSubjects]: (structureId: string) =>
    `${AdminRoute}/structures/${structureId}/subjects`,
  [Route.AdminUsers]: () => `${AdminRoute}/users`,
  [Route.AdminUsersAdd]: () => `${AdminRoute}/users/add`,
  [Route.AdminUser]: (userId: string) => `${AdminRoute}/users/${userId}`,
  [Route.AdminEmails]: () => `${AdminRoute}/emails`,
  [Route.AdminIntegrations]: () => `${AdminRoute}/integrations`
}
