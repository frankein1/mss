const AppRoute = '/app'
const ApiKeycloak = '/api/keycloak'

const BeneficiariesRoute = `${AppRoute}/beneficiaries`
const BeneficiaryRoute = (beneficiaryId: string) =>
  `${BeneficiariesRoute}/${beneficiaryId}`
const BeneficiaryFollowupsRoute = (beneficiaryId: string) =>
  `${BeneficiaryRoute(beneficiaryId)}/followups`

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

  History: () => `${AppRoute}/history`
}
